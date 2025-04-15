import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import manual_1 from "../files/manual-svg/1.svg";
import manual_2 from "../files/manual-svg/2.svg";
import manual_3 from "../files/manual-svg/3.svg";
import manual_4 from "../files/manual-svg/4.svg";
import manual_5 from "../files/manual-svg/5.svg";
import manual_6 from "../files/manual-svg/6.svg";
import manual_7 from "../files/manual-svg/7.svg";
import manual_8 from "../files/manual-svg/8.svg";
import manual_9 from "../files/manual-svg/9.svg";
import manual_10 from "../files/manual-svg/10.svg";
import manual_11 from "../files/manual-svg/11.svg";
import manual_12 from "../files/manual-svg/12.svg";
import manual_13 from "../files/manual-svg/13.svg";
import manual_14 from "../files/manual-svg/14.svg";
import manual_15 from "../files/manual-svg/15.svg";
import manual_16 from "../files/manual-svg/16.svg";
import manual_17 from "../files/manual-svg/17.svg";
import manual_18 from "../files/manual-svg/18.svg";
import manual_19 from "../files/manual-svg/19.svg";
import manual_20 from "../files/manual-svg/20.svg";
import manual_21 from "../files/manual-svg/21.svg";
import manual_22 from "../files/manual-svg/22.svg";
import manual_23 from "../files/manual-svg/23.svg";
import manual_24 from "../files/manual-svg/24.svg";
import manual_25 from "../files/manual-svg/25.svg";
import controller_icon from "../files/manual-svg/icon.svg";
const PisoPlayGuide = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto px-4 ">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          <h1 className="text-xl font-bold text-center flex-1">
            PisoPlay Help Guide Manual
          </h1>

          <div className="w-[60px]"></div> {/* Spacer */}
        </div>
      </header>

      <main className="space-y-6">
        {/* Section: How to Sign Up */}
        <Card>
          <CardHeader className="flex flex-col items-center text-center">
            <CardTitle>How to Sign Up</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <ol className="list-decimal list-inside space-y-2">
              <li >
                Visit{" "}
                <a
                  href="https://www.pisoplays.com"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  www.pisoplays.com
                </a>{" "}
                or use the <b>referral link</b> shared with you.
              </li>
              <li>Click on the <b>"Sign Up"</b> button.</li><br />
              <img
                src={manual_1}
                alt="Enter Mobile and Send OTP"
                className="rounded-lg w-full"
              /><br />
              <li>
                Enter your <b>mobile number</b> and set a <b>password</b>, then
                click <b>"Send OTP"</b>.
              </li><br />
              <img src={manual_2} alt="Verify OTP" className="rounded-lg w-full" /><br />
              <li> Input the <b>OTP</b> and click <b>"Verify OTP & Create Account"</b>.</li><br />
              <img src={manual_3} alt="Verify OTP" className="rounded-lg w-full" /><br />
              <li>You’re all set!</li><br />
              <img
                src={manual_4}
                alt="Click Cash In"
                className="rounded-lg w-full"
              />
            </ol>
          </CardContent>
        </Card>

        {/* Section: How to Cash In */}
        <Card>
          <CardHeader className="flex flex-col items-center text-center">
            <CardTitle>How to Cash In</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <ol className="list-decimal list-inside space-y-2">
              <li>From the homepage, click <b>"Cash In"</b>.</li>
              <img src={manual_5} alt="Enter Amount" className="rounded-lg w-full" />
              <li>Enter the <b>amount</b>.</li>
              <img
                src={manual_6}
                alt="Choose Payment Option"
                className="rounded-lg w-full"
              />
              <li>
                Choose your preferred payment option.{" "}
                <i>For cash-ins from bank accounts</i>, use <b>QRPH</b>.
              </li>
              <img
                src={manual_7}
                alt="Agree and Proceed"
                className="rounded-lg w-full"
              />
              <li>
                Agree to the <b>Terms and Conditions</b> and select <b>Cash In</b>.
              </li>
              <img
                src={manual_8}
                alt="Profile to My Account"
                className="rounded-lg w-full"
              />
            </ol>
          </CardContent>
        </Card>

        {/* How to Share Your Referral Link */}
        <Card>
          <CardHeader className="flex flex-col items-center text-center">
            <CardTitle>How to Share Your Referral Link</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
          <ol className="list-decimal list-inside space-y-2">
            <li>Tap your <b>profile</b> picture located at the top right corner and click <b>“My Account”</b>.</li><br />
            <img src={manual_9} alt="Copy Referral Link" className="rounded-lg w-full" /><br />
            <li>Copy the <b>referral link</b> and share it to make a referral.</li><br />
            <img src={manual_10} alt="Manage Betting Clients" className="rounded-lg w-full" />
          </ol>
          </CardContent>
        </Card>

        {/* How to Manage Betting Clients */}

        <Card>
          <CardHeader className="flex flex-col items-center text-center">
            <CardTitle>How to Manage Betting Clients</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
          <ol className="list-decimal list-inside space-y-2">
            <li>From the homepage, navigate to the <b>Betting Clients</b> section and click on <b>“Manage.”</b></li><br />
            <img src={manual_11} alt="Copy Referral Link" className="rounded-lg w-full" /><br />
            <li>Click <b>“Add Client”</b>.</li><br />
            <img src={manual_12} alt="Manage Betting Clients" className="rounded-lg w-full" /><br />
            <li>Fill in the fields for <b>Full Name, Payment Method,</b> and <b>Account Number</b>. 
              <p>Click <b>“Add”</b>Winning payouts will be automatically credited to the client’s bank</p>
              <p>or e-wallet account.</p></li>
            <img src={manual_13} alt="Manage Betting Clients" className="rounded-lg w-full" />
          </ol>
          </CardContent>
        </Card>

        {/* How to Bet for Your Clients */}
        <Card>
        <CardHeader className="flex flex-col items-center text-center">
        <CardTitle>How to Bet for Your Clients</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center">
        <ol className="list-decimal list-inside space-y-2">
          <li>From the homepage, navigate to the <b>Betting Clients</b> section and click on <b>“Manage”</b>.</li>
          <img src={manual_14} alt="Use Player Controller" className="rounded-lg w-full" />
          <li>Navigate to the client table section and scroll to the right. Click the player controller <img src={controller_icon} alt="Controller Icon" className="w-10 h-10 inline-block ml-1" /></li>
          <img src={manual_15} alt="Currently Playing As" className="rounded-lg w-full" />
          <li>Return to the homepage, where you'll see the <b>“Currently Playing As”</b> box. <p>To switch 
          back to your own account, simply click <b>“Remove”</b>.</p></li>
          <img src={manual_16} alt="Play Game" className="rounded-lg w-full" />
        </ol> 
        </CardContent>  
        </Card>

        {/* How to Place Your Bets */}
        <Card>
          <CardHeader className="flex flex-col items-center text-center">
            <CardTitle>How to Place Your Bets</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <ol className="list-decimal list-inside space-y-2">
              <li>On the homepage, scroll down to the <b>Games</b> section, <b>select the game</b> <p>you want to 
              play, and click <b>“Play”</b>.</p></li>
              <img src={manual_17} alt="Select Draw Date" className="rounded-lg w-full" /><br />
              <li>Select the <b>“Draw Date”</b>.</li>
              <img src={manual_18} alt="Draw Timeslots" className="rounded-lg w-full" /><br />
              <li>Scroll down and select your preferred <b>draw timeslots</b>. Click <b>“Play Game”</b>.</li>
              <img src={manual_19} alt="Game Types" className="rounded-lg w-full" /><br />
              <li>Choose Game Types, if available.</li>
              <img src={manual_20} alt="Number Combination" className="rounded-lg w-full" /><br />
              <li>Select your desired number combinations. </li>
              <img src={manual_21} alt="Lucky Pick" className="rounded-lg w-full" /><br />
              <li>If you’re having trouble picking a combination, press the <b>“dice”</b> button for a <b>Lucky 
              Pick</b>.</li>
              <img src={manual_22} alt="Save Combinations" className="rounded-lg w-full" /><br />
              <li>Click on <b>“Save”</b> to remember your favorite combinations and place bets faster next 
              time.</li>
              <img src={manual_23} alt="Click Bet" className="rounded-lg w-full" /><br />
              <li>Click <b>“Bet”</b>.</li>
              <img src={manual_24} alt="Confirm Bet" className="rounded-lg w-full" /><br />
              <li>Populate the <b>“bet multiplier”</b> field to automatically compute the final bet amount 
                <p>according to the slot count. Once final, click <b>“Confirm Bet”</b>.</p></li>
              <img src={manual_25} alt="Confirm Bet" className="rounded-lg w-full" />
            </ol>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PisoPlayGuide;