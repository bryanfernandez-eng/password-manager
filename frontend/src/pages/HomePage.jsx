import { useUser } from "../context/UserContext";
function HomePage() {
  const { user, loading } = useUser();
  console.log(user);

  if (loading){
    return <p>Loading</p>
  } 

  return <>{!loading && <h1>Welcome {user?.name}</h1>}</>;
}

export default HomePage;
