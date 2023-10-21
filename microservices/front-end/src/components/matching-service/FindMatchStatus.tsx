import styles from "./FindMatchStatus.module.css";

type FindMatchStatusProps = {
  messageToUser: string,
  timeElapsed: number,
  timerIsRunning: boolean
}

const FindMatchStatus = ({
  messageToUser,
  timeElapsed,
  timerIsRunning
}: FindMatchStatusProps) => {

  return (
    <div className={styles.display_container}>
      <div>
        { messageToUser }
      </div>
      {
        !timerIsRunning
          ? <></>
          : (
            <div>
              Time elapsed:{' '}{timeElapsed}s
            </div>
          )
      }
    </div>
  );
}

export default FindMatchStatus;
