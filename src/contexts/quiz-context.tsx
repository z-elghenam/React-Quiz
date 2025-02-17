import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
const SECS_PER_QUESTION = 30;

export interface Question {
  question: string;
  options: string[];
  correctOption: number;
  points: number;
}

interface State {
  questions: Question[];
  status: "loading" | "error" | "ready" | "active" | "finished";
  index: number;
  answer: number | null;
  points: number;
  highscore: number;
  secondsRemaining: number;
}

const initialState: State = {
  questions: [],

  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: localStorage.getItem("highscore")
    ? Number(localStorage.getItem("highscore"))
    : 0,
  secondsRemaining: 0,
};

interface QuizContextValue extends State {
  numQuestions: number;
  maxPossiblePoints: number;
  dispatch: Dispatch<Action>;
}

const QuizContext = createContext<QuizContextValue | undefined>(undefined);

type Action =
  | { type: "dataReceived"; payload: Question[] }
  | { type: "dataFailed" }
  | { type: "start" }
  | { type: "newAnswer"; payload: number }
  | { type: "nextQuestion" }
  | { type: "finish" }
  | { type: "restart" }
  | { type: "tick" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      // eslint-disable-next-line no-case-declarations
      const question = state.questions[state.index];
      if (!question) return state;

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...initialState,
        highscore: state.highscore,
        questions: state.questions,
        status: "ready",
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("Action unkonwn");
  }
}

function QuizContextProvider({ children }: { children: ReactNode }) {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0,
  );

  useEffect(() => {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data: Question[]) =>
        dispatch({ type: "dataReceived", payload: data }),
      )
      .catch(() => dispatch({ type: "dataFailed" }));
  }, []);

  useEffect(() => {
    localStorage.setItem("highscore", String(highscore));
  }, [highscore]);

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        numQuestions,
        maxPossiblePoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { QuizContextProvider, useQuiz };
