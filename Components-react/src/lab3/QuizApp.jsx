import React, { useEffect, useRef, useState } from "react";
import "../assets/Quiz.css";
import { data } from "./data.jsx";

const QuizApp = () => {
    const [index, setIndex] = useState(0);
    const [question, setQuestion] = useState(data[index]);
    const [lock, setLock] = useState(false);
    const [score, setScore] = useState(0);
    const [result, setResult] = useState(false);
    const [playerName, setPlayerName] = useState("");
    const [playerScores, setPlayerScores] = useState([]);
    const [showNameInput, setShowNameInput] = useState(true);

    useEffect(() => {
        const savedScores = JSON.parse(localStorage.getItem("playerScores"));
        if (savedScores) {
            setPlayerScores(savedScores);
        }
    }, []);

    const Option1 = useRef(null);
    const Option2 = useRef(null);
    const Option3 = useRef(null);
    const Option4 = useRef(null);

    const option_arr = [Option1, Option2, Option3, Option4];

    const checkAns = (e, ans) => {
        if (lock)
            return
        if (question.ans === ans) {
            e.target.classList.add("correct");
            setLock(true);
            setScore((prev) => prev + 1);
        } else {
            e.target.classList.add("wrong");
            setLock(true);
            option_arr[question.ans - 1].current.classList.add("correct");
        }
    };

    const next = () => {
        if (lock === true) {
            if (index === data.length - 1) {
                setResult(true);
                saveScore();
                return 0;
            }
            setIndex((prevIndex) => prevIndex + 1);
            setQuestion(data[index + 1]);
            setLock(false);
            option_arr.forEach((option) => {
                option.current.classList.remove("correct");
                option.current.classList.remove("wrong");
            });
        }
    };

    const reset = () => {

        setIndex(0);
        setQuestion(data[0]);
        setScore(0);
        setLock(false);
        setResult(false);
        setShowNameInput(true);
    };

    const saveScore = () => {
        const newScore = { name: playerName, score: score };
        const updatedScores = [...playerScores, newScore];
        setPlayerScores(updatedScores);
        localStorage.setItem("playerScores", JSON.stringify(updatedScores));
    };

    const handleNameChange = (e) => {
        setPlayerName(e.target.value);
    };

    const startQuiz = () => {
        setShowNameInput(false);
    };

    return (
        <div className="container">
            <h1>Quiz App</h1>
            <hr />
            {showNameInput && (
                <div className="card" id="box" class="box1">
                    <h2 id="txt">Enter Your Name</h2>
                    <input type="text" value={playerName} onChange={handleNameChange} id="input" />
                    <button onClick={startQuiz}>Start Quiz</button>
                </div>
            )}
            {!showNameInput && (
                <>
                    {result ? (
                        <>
                            <h2>Your Score: {score}/{data.length}</h2>
                            <button onClick={reset}>Reset</button>
                        </>
                    ) : (
                        <>
                            <h2>
                                {index + 1}. {question.question}
                            </h2>
                            <ul>
                                <li
                                    ref={Option1}
                                    onClick={(e) => {
                                        checkAns(e, 1);
                                    }}
                                >
                                    {question.option1}
                                </li>
                                <li
                                    ref={Option2}
                                    onClick={(e) => {
                                        checkAns(e, 2);
                                    }}
                                >
                                    {question.option2}
                                </li>
                                <li
                                    ref={Option3}
                                    onClick={(e) => {
                                        checkAns(e, 3);
                                    }}
                                >
                                    {question.option3}
                                </li>
                                <li
                                    ref={Option4}
                                    onClick={(e) => {
                                        checkAns(e, 4);
                                    }}
                                >
                                    {question.option4}
                                </li>
                            </ul>
                            <button onClick={next}>Next</button>
                            <div className="index">
                                {index + 1} of {data.length} questions
                            </div>
                        </>
                    )}
                    {result && (
                        <div>
                            <h2 id="txt2">Player Scores</h2>
                            <table id="table" border="solid 1px" width="400" class="tb">
                                <tr >
                                    <th width="50">#</th>
                                    <th width="100">Name</th>
                                    <th width="50">Score</th>

                                </tr>

                                <tbody id="tbody">
                                    {playerScores.map((player, index) => (
                                        <tr key={index} >
                                            <td>{index + 1}</td>
                                            <td>{player.name}</td>
                                            <td>{player.score}</td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default QuizApp;
