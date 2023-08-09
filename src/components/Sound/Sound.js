import React, { forwardRef, useImperativeHandle } from "react";
import "./Sound.scss";
import { splitOnUnderscore } from "../../utils/stringFormatting";
import likeBtn from "../../assets/images/icons/heart-black.svg";

const Sound = forwardRef(
  (
    {
      sound,
      mutedStates,
      handleMuteClick,
      handleLikeClickDrums,
      isShakingDrums,
      playAnimationClass,
    },
    ref
  ) => {
    const audioRef = React.useRef(null);

    // Expose play and pause methods to the parent component
    useImperativeHandle(ref, () => ({
      play() {
        audioRef.current.play();
      },
      pause() {
        audioRef.current.pause();
      },
    }));

    return (
      <article
        className={`sound sound--1 ${mutedStates[0] ? "sound--muted" : ""}`}
        onClick={() => handleMuteClick(0)}
      >
        <div
          className={
            playAnimationClass ? "sound__overlay sound__overlay--1" : ""
          }
        ></div>
        <button
          className="sound__button"
          onClick={(e) => handleLikeClickDrums(e, sound[0].id)}
        >
          <img
            className={`sound__like-icon ${
              isShakingDrums ? "sound__like-icon--shake" : ""
            }`}
            src={likeBtn}
            alt="like icon"
          />
        </button>
        <div className="sound__info-container">
          <h2 className="sound__type">{sound[0].type.toUpperCase()}</h2>
          <h3 className="sound__name">{splitOnUnderscore(sound[0].name)}</h3>
        </div>
        <audio
          ref={audioRef}
          src={sound[0].url}
          loop
          preload="auto"
          autoPlay
        ></audio>
      </article>
    );
  }
);

export default Sound;
