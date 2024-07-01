import { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span className="text-white" key={interval}>
        {(()=>{
            if (interval == "days") {
                return <>
                    {timeLeft[interval]} dias
                    <br></br>
                </>
            }

            if (!timeLeft[interval]) {
              return "00" + (interval == "seconds" ? "" : ":")
            }

            return String(timeLeft[interval]).padStart(2, '0') + (interval == "seconds" ? "" : ":");
        })(interval)}

        {/* {timeLeft[interval]}{":"} */}
      </span>
    );
  });

  return (
    <div className="text-white w-full text-4xl">
      {timerComponents.length ? timerComponents : <span>Contagem finalizada!</span>}
    </div>
  );
};

export default CountdownTimer;
