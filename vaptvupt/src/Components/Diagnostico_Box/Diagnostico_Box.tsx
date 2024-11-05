"use client";
import { Standard } from "@typebot.io/nextjs";
import "./Diagnostico_Box.css";
import {
  useRive,
  useStateMachineInput,
  Layout,
  Fit,
  Alignment,
} from "@rive-app/react-canvas";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Diagnostico_Box = () => {
  const { rive, RiveComponent } = useRive({
    src: "rive/Animation.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  const clicouInputBoolean = useStateMachineInput(
    rive,
    "State Machine 1",
    "Clicou_Input_boolean"
  );
  const deuEnterTrigger = useStateMachineInput(
    rive,
    "State Machine 1",
    "Deu_Enter"
  );

  useEffect(() => {
    const handleFocus = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.matches("input, textarea, [contenteditable='true']")) {
        if (clicouInputBoolean) {
          clicouInputBoolean.value = true; // Set to true on focus
          console.log("Clicou_Input_boolean set to true on focus");
        }
      }
    };

    const handleBlur = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.matches("input, textarea, [contenteditable='true']")) {
        setTimeout(() => {
          if (clicouInputBoolean) {
            clicouInputBoolean.value = false; // Set to false on blur
            console.log("Clicou_Input_boolean set to false on blur");
          }
        }, 100); // Adjust delay as needed
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;

      if (
        event.key === "Enter" &&
        (target.matches("input, textarea") ||
          target.hasAttribute("contenteditable"))
      ) {
        event.preventDefault(); // Prevent default Enter behavior

        // Trigger the animation when Enter is pressed
        if (deuEnterTrigger) {
          deuEnterTrigger.fire(); // Trigger the animation
          console.log("Deu_Enter triggered");
        }

        // Log user input
        let userInput = "";
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement
        ) {
          userInput = target.value; // Get value from form input
        } else if (target.hasAttribute("contenteditable")) {
          userInput = target.textContent || ""; // Get text from contenteditable
        }

        if (userInput.trim()) {
          console.log("User input:", userInput); // Process the input as needed
        }
      }
    };

    const addEventListeners = () => {
      document.addEventListener("focusin", handleFocus);
      document.addEventListener("focusout", handleBlur);
      document.addEventListener("keydown", handleKeyDown);
    };

    // Start the animation automatically when the component mounts with a delay
    const startAnimationWithDelay = () => {
      setTimeout(() => {
        if (clicouInputBoolean) {
          clicouInputBoolean.value = true; // Start the animation after 1 second
          console.log("Clicou_Input_boolean set to true on mount with delay");
        }
      }, 500); // 1 second delay
    };

    // Call the function to start the animation
    startAnimationWithDelay();

    // Attach event listeners
    addEventListeners();

    return () => {
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("focusout", handleBlur);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [clicouInputBoolean, deuEnterTrigger]);

  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const oficinaValue = sessionStorage.getItem("Oficina");
      if (oficinaValue === "true") {
        router.push("/oficinas");
      }
    }, 1000);

    return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar
  }, [router]);

  return (
    <div id="Diagnostico_Box">
      <div>
        <Standard
          typebot="vapt-vupt-sniy2bb"
          style={{ width: "100%", height: "100%" }}
        />
        <RiveComponent className="rive" />
      </div>
    </div>
  );
};

export default Diagnostico_Box;
