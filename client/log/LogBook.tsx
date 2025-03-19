"use client";
import { useEffect, useRef } from "react";
import { autoFillLogbook } from "./FilLogBook";

const LogBook: React.FC = () => {
  const gridSize = 30; // Each box is 30x30 pixels
  const logbooks = autoFillLogbook(); // Now returns multiple logbooks

  return (
    <div className="w-full flex flex-col gap-8 p-5 bg-[#f5f5f5] border-solid border-2 border-black">
      {logbooks.map((logbook, index) => (
        <SingleLogbook
          timeSpentInOffDuty={logbook.timeSpentInOffDuty}
          timeSpentInOnDuty={logbook.timeSpentInOnDuty}
          timeSpentInDriving={logbook.timeSpentInDriving}
          timeSpentInSleeperBerth={logbook.timeSpentInSleeperBerth}
          key={index}
          logbook={logbook.logbook}
          gridSize={gridSize}
          day={index + 1}
        />
      ))}
    </div>
  );
};

type LogEntry = {
  hour: number;
  row: "off-duty" | "sleeper" | "driving" | "on-duty";
};

type LogbookProps = {
  logbook: LogEntry[];
  gridSize: number;
  day: number;
  timeSpentInOffDuty: number;
  timeSpentInOnDuty: number;
  timeSpentInDriving: number;
  timeSpentInSleeperBerth: number;
};

const SingleLogbook: React.FC<LogbookProps> = ({
  logbook,
  gridSize,
  day,
  timeSpentInOffDuty,
  timeSpentInOnDuty,
  timeSpentInDriving,
  timeSpentInSleeperBerth,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    const cols = 24;
    const rows = 4;
    canvas.width = cols * gridSize;
    canvas.height = rows * gridSize;

    // **Row colors for Off-Duty, Sleeper, Driving, On-Duty**
    const rowColors: string[] = ["#FFD700", "#87CEEB", "#90EE90", "#FFB6C1"];
    const rowPositions: Record<string, number> = {
      "off-duty": 15,
      sleeper: 45,
      driving: 75,
      "on-duty": 105,
    };

    // **Draw Background Grid**
    const colorRows = () => {
      for (let i = 0; i < rows; i++) {
        ctx.fillStyle = rowColors[i];
        ctx.fillRect(0, i * gridSize, canvas.width, gridSize);
      }
    };

    const drawGrid = () => {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    // **Draw Logbook Entries Correctly (With Vertical Transitions)**
    const drawLogbook = () => {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 3;
      ctx.beginPath();

      logbook.forEach((entry, index) => {
        const x = entry.hour * gridSize;
        const y = rowPositions[entry.row];

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevEntry = logbook[index - 1];
          const prevX = prevEntry.hour * gridSize;
          const prevY = rowPositions[prevEntry.row];

          if (prevY !== y) {
            ctx.lineTo(prevX, y); // **Draw vertical line when switching rows**
          }

          ctx.lineTo(x, y); // **Draw horizontal line for current duty**
        }
      });

      ctx.stroke();
    };

    // **Draw Everything**
    colorRows();
    drawGrid();
    drawLogbook();
  }, [logbook, gridSize]); // Depend on `logbook` so it updates only when needed

  return (
    <div className="flex flex-col items-center gap-2">
      <h3 className="text-lg font-bold">Day {day}</h3>
      <div className="flex flex-row justify-center items-center overflow-x-auto border-solid border-2 border-black p-3">
        <div className="text-xs font-bold flex flex-col justify-center items-end gap-3.5 mr-2">
          <p>Off Duty</p>
          <p>Sleeper Berth</p>
          <p>Driving</p>
          <div className="flex flex-col justify-center items-center">
          <p>On Duty</p>
          <p className="text-xs">(Not Driving)</p>
          </div>
        </div>
        <canvas ref={canvasRef}></canvas>
        <div className="flex flex-col justify-center items-end ml-2 border-[1px] font-bold">
          <div className="w-[40px] h-[30px] bg-[#FFD700] border-b-[1px] text-center">
            {timeSpentInOffDuty}
          </div>
          <div className="w-[40px] h-[30px] bg-[#87CEEB] border-b-[1px] text-center">
            {timeSpentInSleeperBerth}
          </div>
          <div className="w-[40px] h-[30px] bg-[#90EE90] border-b-[1px] text-center">
            {timeSpentInDriving}
          </div>
          <div className="w-[40px] h-[30px] bg-[#FFB6C1] text-center">
            {timeSpentInOnDuty}
          </div>
        </div>
      </div>
        <div className="self-end mr-[220px] border-solid border-b-[2px] font-bold px-4">{timeSpentInOffDuty + timeSpentInSleeperBerth + timeSpentInDriving + timeSpentInOnDuty}</div>
    </div>
  );
};

export default LogBook;
