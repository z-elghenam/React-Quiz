import { useEffect } from "react"; 
import { useQuiz } from "../contexts/quiz-context"; 
 
function Timer() { 
  const { dispatch, secondsRemaining } = useQuiz(); 

  useEffect(() => { 

    const id = setInterval(() => { 
      dispatch({ type: "tick" }); 
    }, 1000); 

    return () => clearInterval(id); 
  }, [dispatch]); 
 
  if (secondsRemaining === null) return null; 
 
  const mins = Math.floor(secondsRemaining / 60); 
  const seconds = secondsRemaining % 60; 

  return ( 
    <div className="timer"> 
      {mins.toString().padStart(2, "0")}: 
      {seconds.toString().padStart(2, "0")} 
    </div> 
  ); 
} 
 
export default Timer;
