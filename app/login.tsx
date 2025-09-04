import React from 'react'
const Login = () => {
  return (
    <div className=' flex items-center justify-center  '>
        <form className="max-w-sm mx-auto mt-10 p-8  rounded-lg shadow-md">
      <div className="mb-6 ">
        <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">
          Username:
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
      >
        Login
      </button>
    </form>
    </div>
  )
}

export default Login