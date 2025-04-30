import React from "react";
import Link from "next/link";

interface Props {
  setIsModalOpen: (isModalOpen: boolean) => void;
}

export function JoinCommunityModal({ setIsModalOpen }: Props) {
  return (
    <>
      <>
        <input type="checkbox" id="community-modal" className="modal-toggle" checked readOnly />
        <div className="modal modal-open">
          <div className="modal-box relative bg-gray-100">
            <label
              htmlFor="community-modal"
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </label>
            <div className="prose prose-lg font-sans text-black">
              <h1 className="text-center font-bold text-2xl">Welcome to ETH Rwanda 🌍</h1>
              <p>
                We are a <strong>decentralized community</strong> of blockchain enthusiasts, developers, and innovators
                based in Rwanda. Our mission is to <strong>drive blockchain adoption</strong> and create real-world
                impact through Ethereum.
              </p>
              <p>
                Your voice matters here—whether you&apos;re an <strong>entrepreneur</strong>, a{" "}
                <strong>developer</strong>,<strong> techie</strong>, or <strong>not tech-savvy</strong>!
              </p>
              <hr />
              <h2 className="mt-5 mb-3 font-bold text-center">What We Offer 🍯</h2>
              <ul>
                <li>
                  <strong>Workshops</strong>: Level up your skills and expand your knowledge of the Ethereum blockchain.
                </li>
                <li>
                  <strong>Community Artifacts</strong> 🖼️: Collect unique and valuable items as you participate.
                </li>
                <li>
                  <strong>Quests & Bounties</strong> 🎯: Engage in exciting activities and earn rewards.
                </li>
                <li>
                  <strong>Side Quests</strong> 🏕️: Keep an eye out for special tasks from ETH Rwanda and earn tokens on
                  completion 🎁.
                </li>
              </ul>
              <p>
                Together, we <strong>learn</strong>, <strong>grow</strong>, and <strong>build</strong> a better world.
              </p>
              <hr />
              <p className="mt-4">
                Join ETH Rwanda and become part of the movement shaping the future of blockchain in Africa! 🚀
              </p>
            </div>
            <div className="modal-action justify-center">
              <Link
                target="_blank"
                href="https://app.unlock-protocol.com/checkout?id=2e0a1a15-6f2c-4b69-be48-c6d453fe12ad"
              >
                <button className="btn btn-wide btn-neutral" onClick={() => setIsModalOpen(false)}>
                  Join the Community
                </button>
              </Link>
            </div>
          </div>
        </div>
      </>
    </>
  );
}
