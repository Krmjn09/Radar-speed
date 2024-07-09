import React from "react"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import Image from "next/image"
import logo from "../app/images/TIET-Logo.png"
import bg from "../app/images/bg.jpg"

export default async function Home() {
  const { userId } = await auth()

  return (
    <div
      className="w-screen h-screen flex justify-center items-center text-white"
      style={{
        backgroundImage: `url(${bg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-[600px] mx-auto text-center">
        <Image
          src={logo}
          alt="Logo"
          className="mx-auto mb-3"
          style={{ maxWidth: "550px", marginBottom: "3rem", height: "130px" }}
          width={250}
          height={150}
        />
        <h1 className="text-4xl mb-4 text-black">
          Smart Speed Detection: Smiles for Safety, Alerts for Action
        </h1>
        <p className="text-1xl text-black/60 mb-4">
          Our RADAR speed detection system promotes safe driving by displaying
          happy emojis for compliant speeds and capturing photos when limits are
          exceeded. All data is sent to the cloud for easy access and
          monitoring. Drive smarter with our innovative solution.
        </p>
        <div>
          <Link href="/home">
            <button className="bg-blue-600 px-4 py-2 rounded-lg text-xl">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
