"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { app } from "../../../firebase";
import { useRouter } from "next/navigation";
import axios from "axios";

type NewUserType = {
  name: string;
  email: string;
  password: string;
};

const SignUp = () => {
  const auth = getAuth(app);
  const router = useRouter();
  const [newUser, setNewUser] = useState<NewUserType>({
    name: "",
    email: "",
    password: "",
  });

  const client3 = axios.create({
    baseURL: "http://localhost:3000/api/v1/auth/registrations/",
  });

  const signUpUser = (config: any) => {
    return client3.post("/", config);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    const request = async () => {
      e.preventDefault();
      await signUpEmail();
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken(true);
        const config = { token };
        try {
          await signUpUser(config);
          router.push("/login");
        } catch (e) {
          console.log(e);
        }
      }
    };
    request();
  };

  const signUpEmail = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );
      await updateProfile(auth.currentUser!, { displayName: newUser.name });
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <>
      <div>SignUp</div>
      <form onSubmit={handleOnSubmit}>
        <div>
          <label htmlFor="name">name: </label>
          <input
            id="name"
            name="name"
            placeholder="name"
            type="text"
            onChange={handleChange}
          />
        </div>
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
        <button type="submit">SignUp</button>
      </form>
    </>
  );
};

export default SignUp;
