// pages/index.tsx

import SessionForm from "@/components/SessionForm";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome to Live Chat</h1>
      <SessionForm />
    </div>
  );
};

export default Home;
