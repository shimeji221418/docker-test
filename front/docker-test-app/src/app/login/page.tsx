"use client";
import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";
import { app } from "../../../firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type TestUser = {
  id: number;
  name: string;
  email: string;
  uid: string;
};

type LoginUser = {
  email: string;
  password: string;
};

const Login = () => {
  const auth = getAuth(app);
  const router = useRouter();
  const [testUsers, setTestUsers] = useState<Array<TestUser>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loginUser, setLoginUser] = useState<LoginUser>({
    email: "",
    password: "",
  });

  const client = applyCaseMiddleware(
    axios.create({
      baseURL: "http://localhost:3000/api/v1/users",
    })
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setLoginUser({ ...loginUser, [name]: value });
  };

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(
        auth,
        loginUser.email,
        loginUser.password
      );
      router.push("/");
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await client.get("/");
        setTestUsers(res.data);
        console.log(res.data);
        setLoading(false);
      } catch (e: any) {
        console.log(e);
      }
    };
    getUser();
  }, []);

  return (
    <>
      {!loading && (
        <>
          <div>login</div>
          {testUsers.map((user) => (
            <ul key={user.id}>
              <li>{user.name}</li>
              <li>{user.email}</li>
            </ul>
          ))}
          <form onSubmit={handleOnSubmit}>
            <div>
              <label htmlFor="email">email: </label>
              <input
                id="email"
                name="email"
                placeholder="email"
                type="text"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password">password: </label>
              <input
                id="password"
                name="password"
                placeholder="password"
                type="password"
                onChange={handleChange}
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </>
      )}
    </>
  );
};

export default Login;
