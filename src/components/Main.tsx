import { type ReactNode } from "react";

type MainProps = {
  children: ReactNode;
};

function Main({ children }: MainProps) {
  return <main className="main">{children}</main>;
}

export default Main;
