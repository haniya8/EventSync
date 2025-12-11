export default function Navbar({ user }) {
  return (
    <div className="w-full bg-gray-900 border-b border-gray-800 px-8 py-4 flex justify-between items-center">
      <h2 className="text-xl text-gray-300 font-semibold">Welcome, {user.NAME}</h2>
      <span className="text-gray-500 text-sm">
        CNIC: {user.CNIC}
      </span>
    </div>
  );
}
