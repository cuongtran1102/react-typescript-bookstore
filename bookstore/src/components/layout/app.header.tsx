import { useAppContext } from "../context/app.context";

const AppHeader = () => {
  const { currentUser } = useAppContext();
  return <div>{JSON.stringify(currentUser)}</div>;
};

export default AppHeader;
