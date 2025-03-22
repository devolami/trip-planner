"use client";
import { useEffect, useRef } from "react";
// import { autoFillLogbook } from "./FilLogBook";
import { useRoute } from "../contexts";

const LogBook: React.FC = () => {
  const gridSize = 40; // Each box is 30x30 pixels
  // const logbooks = autoFillLogbook(); // Now returns multiple logbooks
  const {logData} = useRoute();

  return (
    <div className="w-full flex flex-col gap-8 p-5 bg-[#f5f5f5] border-solid border-2 border-black">
      {logData && logData.length > 0 && logData.map((logbook, index) => (
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
  action?: string;
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

    const rowColors: string[] = ["#DAC0FD", "#FFECC5", "#CFFFE8", "#C9F5FF"];
    const rowPositions: Record<string, number> = {
      "off-duty": 20, //15
      sleeper: 60, //45
      driving: 100, //75
      "on-duty": 140, //105
    };

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
    
        // 🎯 Draw small lines inside each grid in all rows
        const interval = gridSize / 4; // Divide each grid into 4 equal parts
    
        for (let y = 0; y < canvas.height; y += gridSize) {
          // ✅ First small line (10px)
          ctx.beginPath();
          ctx.moveTo(x + interval, y); // Start at top of the box
          ctx.lineTo(x + interval, y + 10); // 10px height
          ctx.stroke();
    
          // ✅ Middle line (20px)
          ctx.beginPath();
          ctx.moveTo(x + 2 * interval, y);
          ctx.lineTo(x + 2 * interval, y + 20); // 20px height
          ctx.stroke();
    
          // ✅ Third small line (10px)
          ctx.beginPath();
          ctx.moveTo(x + 3 * interval, y);
          ctx.lineTo(x + 3 * interval, y + 10); // 10px height
          ctx.stroke();
        }
      }
    
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };
    
    

    const drawLogbook = () => {
      ctx.strokeStyle = "black";
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
            ctx.lineTo(prevX, y);
          }
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    };

    colorRows();
    drawGrid();
    drawLogbook();
  }, [logbook, gridSize]);

  return (
    <div className="h-[350px] flex flex-col items-center gap-1 border-solid border-2 border-black pl-10">
      <h3 className="text-lg font-bold">Day {day}</h3>
      {/* ✅ Scrollable Wrapper */}
      <div className="w-full h-full overflow-x-auto flex flex-row gap-2 whitespace-nowrap">
        {/* ✅ Duty Labels */}
        <div className="text-xs font-bold flex flex-col items-end gap-6 whitespace-nowrap pt-12">
          <p>Off Duty</p>
          <p>Sleeper Berth</p>
          <p>Driving</p>
          <div className="flex flex-col justify-center items-center">
            <p>On Duty</p>
            <p className="text-xs">(Not Driving)</p>
          </div>
        </div>

        {/* ✅ Main Canvas Container */}
        <div className="relative flex flex-col min-h-0 pt-12">
          <canvas ref={canvasRef}></canvas>
          <div className="flex flex-row gap-6 absolute top-[-2px] left-[-30px] text-xs font-bold bg-[#9E77ED] text-white p-2 justify-center items-end">
            <p className="mr-[-10px]">Mid-<br/>Night</p>
            <p>1</p>
            <p className="mr-2">2</p>
            <p className="mr-3">3</p>
            <p className="mr-4">4</p>
            <p className="mr-2">5</p>
            <p className="mr-3">6</p>
            <p className="mr-2">7</p>
            <p className="mr-2">8</p>
            <p>9</p>
            <p>10</p>
            <p>11</p>
            <p>Noon</p>
            <p>1</p>
            <p className="mr-2">2</p>
            <p className="mr-3">3</p>
            <p className="mr-4">4</p>
            <p className="mr-2">5</p>
            <p className="mr-3">6</p>
            <p className="mr-2">7</p>
            <p className="mr-2">8</p>
            <p>9</p>
            <p>10</p>
            <p className="mr-1">11</p>
            <p className="mr-[-8px]">Mid-<br/>Night</p>
            <p>Total <br/> Hours</p>
          </div>

          {/* ✅ On-Duty Actions */}
          {logbook.map((entry, index, arr) => {
            if (
              entry.row === "on-duty" &&
              index > 0 &&
              arr[index - 1].row === "on-duty"
            ) {
              const x = entry.hour * gridSize;
              return (
                <div
                  key={index}
                  className="absolute text-xs font-bold text-black rotate-45 pt-12 tracking-wider"
                  style={{
                    left: `${x - 6}px`,
                    top: "205px",
                  }}
                >
                  {entry.action}
                </div>
              );
            }
          })}
        </div>

        {/* ✅ Total Hours for Each Duty */}
        <div className="flex flex-col font-bold pt-12">
          <div className="w-[45px] h-[40px] bg-[#DAC0FD] border-b-[1px] flex flex-row justify-center items-center">
            {!Number.isInteger(timeSpentInOffDuty)
              ? `${Math.trunc(timeSpentInOffDuty)}:30`
              : `${timeSpentInOffDuty}:00`}
          </div>
          <div className="w-[45px] h-[40px] bg-[#FFECC5] border-b-[1px] flex flex-row justify-center items-center">
            {!Number.isInteger(timeSpentInSleeperBerth)
              ? `${Math.trunc(timeSpentInSleeperBerth)}:30`
              : `${timeSpentInSleeperBerth}:00`}
          </div>
          <div className="w-[45px] h-[40px] bg-[#CFFFE8] border-b-[1px] flex flex-row justify-center items-center">
            {!Number.isInteger(timeSpentInDriving)
              ? `${Math.trunc(timeSpentInDriving)}:30`
              : `${timeSpentInDriving}:00`}
          </div>
          <div className="w-[45px] h-[40px] bg-[#C9F5FF] flex flex-row justify-center items-center">
            {!Number.isInteger(timeSpentInOnDuty)
              ? `${Math.trunc(timeSpentInOnDuty)}:30`
              : `${timeSpentInOnDuty}:00`}
          </div>
          {/* Total Hours Row */}

          <p className="border-solid border-b-[2px] text-white font-bold h-[40px] w-[45px] px-6 ml-[-5px] mt-6 bg-[#9E77ED] flex flex-col justify-center items-center">
            {timeSpentInOffDuty +
              timeSpentInSleeperBerth +
              timeSpentInDriving +
              timeSpentInOnDuty}
            :00
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogBook;
