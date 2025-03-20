type LogEntry = {
  hour: number;
  row: "off-duty" | "sleeper" | "driving" | "on-duty";
  action?: string
};

type Logbook = {
  logbook: LogEntry[];
  currentHour: number;
  totalTimeTraveled: number;
  timeSpentInOffDuty: number;
  timeSpentInOnDuty: number;
  timeSpentInDriving: number;
  timeSpentInSleeperBerth: number;
};

export const autoFillLogbook = (
  currentCycleHours: number = 30,
  DurationFromCurrentLocationToPickup: number = 307,
  totalTimeMinutes: number = 855,
  totalDistanceMiles: number = 624,
  previousTotalTimeTraveled: number = 0,
  prevSleeperBerthHr: number = 0
): Logbook[] => {
  const drivingTime = totalTimeMinutes;
  const pickUpAndDropOffTime = 60;
  const numFuelingStops = Math.floor(totalDistanceMiles / 1000);
  const totalTimeToRefuel = numFuelingStops * 30;
  let milesTraveled = 0; // Track distance driven
  let timeTraveledWithinEightHrs = 0;
  let currentOnDutyHour = 0;
  const totalOnDutyTime =
    drivingTime + totalTimeToRefuel + pickUpAndDropOffTime;

  const remainingCycleHours = (70 - currentCycleHours) * 60;
  let timeSpentInOffDuty = 0;
  let timeSpentInOnDuty = 0;
  let timeSpentInDriving = 0;
  let timeSpentInSleeperBerth = 0;

  if (remainingCycleHours < totalOnDutyTime) {
    console.log("Driver does not have enough hours left in cycle.");
    return [];
  }

  const logbooks: Logbook[] = [];
  let totalTimeTraveled: number = previousTotalTimeTraveled;
  let currentHour: number = 0;

  const generateNewLog = (): Logbook => {
    return {
      logbook: [],
      currentHour: 0,
      totalTimeTraveled,
      timeSpentInOffDuty,
      timeSpentInOnDuty,
      timeSpentInDriving,
      timeSpentInSleeperBerth,
    };
  };

  const newLog = generateNewLog();
  logbooks.push(newLog);

  if (prevSleeperBerthHr > 0 && prevSleeperBerthHr >= 10) {
    // **Step 1: Start at On-Duty (Vehicle Check)**
    newLog.logbook.push({ hour: currentHour, row: "on-duty", action: "Switched to on-duty" });
    currentHour += 0.5;

    // **Step 2: Stay On-Duty Before Driving**
    newLog.logbook.push({ hour: currentHour, row: "on-duty", action: "Pre-trip/TIV" });
    currentHour += 0.5;
    currentOnDutyHour += 0.5;
    timeSpentInOnDuty += 0.5;

    // **Step 3: Start Driving to Pickup or drop-off**
    newLog.logbook.push({ hour: currentHour, row: "driving" });
  } else if (prevSleeperBerthHr > 0 && prevSleeperBerthHr < 10) {
    // **Step 1: Start at sleeper berth until you have spent 10 hours there**
    newLog.logbook.push({ hour: currentHour, row: "sleeper" });
    currentHour += 10 - prevSleeperBerthHr;
    timeSpentInSleeperBerth += 10 - prevSleeperBerthHr;
    newLog.logbook.push({ hour: currentHour, row: "sleeper" });

    // **Step 2: Switch to On-Duty (Vehicle Check)**
    newLog.logbook.push({ hour: currentHour, row: "on-duty" });
    currentHour += 0.5;
    timeSpentInOnDuty += 0.5;

    // **Step 3: Stay On-Duty Before Driving**
    newLog.logbook.push({ hour: currentHour, row: "on-duty", action: "Pre-trip/TIV" });
    currentHour += 0.5;
    currentOnDutyHour += 0.5;
    timeSpentInDriving += 0.5;

    // **Step 4: Start Driving to Pickup**
    newLog.logbook.push({ hour: currentHour, row: "driving" });
  } else {
    // **Step 1: Start with Off-Duty until 6:30 AM**
    newLog.logbook.push({ hour: currentHour, row: "off-duty" });
    currentHour += 6.5;
    timeSpentInOffDuty += 6.5;
    newLog.logbook.push({ hour: currentHour, row: "off-duty" });

    // **Step 2: Switch to On-Duty (Vehicle Check)**
    newLog.logbook.push({ hour: currentHour, row: "on-duty" });
    currentHour += 0.5;
    timeSpentInOnDuty += 0.5;

    // **Step 3: Stay On-Duty Before Driving**
    newLog.logbook.push({ hour: currentHour, row: "on-duty", action: "Pre-trip/TIV" });
    currentHour += 0.5;
    currentOnDutyHour += 0.5;
    timeSpentInDriving += 0.5;

    // **Step 4: Start Driving to Pickup**
    newLog.logbook.push({ hour: currentHour, row: "driving" });
  }
  while (totalTimeTraveled < DurationFromCurrentLocationToPickup) {
    // Base Condition: Stop Recursion if Trip is Done
    if (totalTimeTraveled >= DurationFromCurrentLocationToPickup) {
      break; // Trip is complete, return logs
    }
    currentHour += 1;
    currentOnDutyHour += 1;
    newLog.logbook.push({ hour: currentHour, row: "driving" });
    totalTimeTraveled += 60;
    timeTraveledWithinEightHrs += 60;
    timeSpentInDriving += 1;
    milesTraveled += (totalDistanceMiles / drivingTime) * 60; // Convert minutes to miles

    // **Mandatory 30-min break after 8 hours driving or to refuel after 1,000 miles**
    if (timeTraveledWithinEightHrs >= 8 * 60 || milesTraveled >= 1000) {
      console.log(
        `${
          timeTraveledWithinEightHrs >= 8 * 60
            ? "Mandatory rest after 8hr"
            : "Refuelling"
        }`
      );
      newLog.logbook.push({ hour: currentHour, row: "on-duty" });
      currentHour += 0.5;
      currentOnDutyHour += 0.5;
      timeSpentInOnDuty += 0.5;
       const action = timeTraveledWithinEightHrs >= 8 * 60 ? "30-minute break": "Refuelling"
      newLog.logbook.push({ hour: currentHour, row: "on-duty", action: action });

      newLog.logbook.push({ hour: currentHour, row: "driving" });
      milesTraveled = milesTraveled >= 1000 ? 0 : milesTraveled;
      timeTraveledWithinEightHrs =
        timeTraveledWithinEightHrs >= 8 * 60 ? 0 : timeTraveledWithinEightHrs;
    }

    // **Stop Driving after 11 total hours of driving or 14 hours of on-duty (Switch to Sleeper Berth)**
    if (timeTraveledWithinEightHrs >= 11 * 60 || currentOnDutyHour >= 14) {
      console.log(
        `${
          timeTraveledWithinEightHrs >= 11 * 60
            ? "Mandatory rest after 11 hr"
            : "14-hour limit reached"
        }`
      );
      newLog.logbook.push({ hour: currentHour, row: "sleeper" });

      // **Stay in Sleeper Berth for 10 hours**
      const timeToStayInSleeperBerth = 24 - currentHour;
      currentHour += timeToStayInSleeperBerth;
      timeSpentInSleeperBerth += timeToStayInSleeperBerth;
      newLog.logbook.push({ hour: currentHour, row: "sleeper" });

      // **Start a New Day & Continue Logging (Recursive Call)**
      const nextDayLogs = autoFillLogbook(
        currentCycleHours,
        DurationFromCurrentLocationToPickup - totalTimeTraveled, // ✅ Remaining travel time to pickup
        totalTimeMinutes - totalTimeTraveled, // ✅ Remaining total trip time
        totalDistanceMiles,
        totalTimeTraveled, // ✅ Keep tracking time across days
        timeToStayInSleeperBerth
      );

      return [...logbooks, ...nextDayLogs]; // Combine all logbooks
    }
  }

  // **Step 5: Arrive at Pickup, Stay On-Duty for 30 minutes**
  newLog.logbook.push({ hour: currentHour, row: "on-duty" });
  console.log("Arrived at pickup location");
  currentHour += 0.5; // 30-minute On-Duty for Pickup
  currentOnDutyHour += 0.5;
  timeSpentInOnDuty += 0.5;

  newLog.logbook.push({ hour: currentHour, row: "on-duty", action: "Pickup" });

  // **Step 6: Start Driving to Drop-off Immediately**
  newLog.logbook.push({ hour: currentHour, row: "driving" });
  //   totalTimeTraveled = 0; // Reset driving time for drop-off

  // **Step 7: Continue Driving to Drop-off**
  while (
    totalTimeTraveled <
    drivingTime - DurationFromCurrentLocationToPickup
  ) {
    // Base Condition: Stop Recursion if Trip is Done
    if (totalTimeTraveled >= drivingTime) {
      break; // Trip is complete, return logs
    }
    currentHour += 1;
    currentOnDutyHour += 1;
    newLog.logbook.push({ hour: currentHour, row: "driving" });
    totalTimeTraveled += 60;
    timeTraveledWithinEightHrs += 60;
    timeSpentInDriving += 1;
    milesTraveled += (totalDistanceMiles / drivingTime) * 60; // Convert minutes to miles

    // **Mandatory 30-min break after 8 hours driving or to refuel after 1,000 miles**
    if (timeTraveledWithinEightHrs >= 8 * 60 || milesTraveled >= 1000) {
      console.log(
        `${
          timeTraveledWithinEightHrs >= 8 * 60
            ? "Mandatory rest after 8hr"
            : "Refuelling"
        }`
      );
      newLog.logbook.push({ hour: currentHour, row: "on-duty" });
      currentHour += 0.5;
      currentOnDutyHour += 0.5;
      timeSpentInOnDuty += 0.5;
      const action = timeTraveledWithinEightHrs >= 8 * 60 ? "30-minute break": "Refuelling"
      newLog.logbook.push({ hour: currentHour, row: "on-duty", action: action });

      newLog.logbook.push({ hour: currentHour, row: "driving" });
      milesTraveled = milesTraveled >= 1000 ? 0 : milesTraveled;
      timeTraveledWithinEightHrs =
        timeTraveledWithinEightHrs >= 8 * 60 ? 0 : timeTraveledWithinEightHrs;
    }

    // **Stop Driving after 11 total hours of driving or 14 hours of on-duty (Switch to Sleeper Berth)**
    if (timeTraveledWithinEightHrs >= 11 * 60 || currentOnDutyHour >= 14) {
      console.log(
        `${
          timeTraveledWithinEightHrs >= 11 * 60
            ? "Mandatory rest after 11 hr"
            : "14-hour limit reached"
        }`
      );
      newLog.logbook.push({ hour: currentHour, row: "sleeper" });

      // **Stay in Sleeper Berth for 10 hours**
      const timeToStayInSleeperBerth = 24 - currentHour;
      currentHour += timeToStayInSleeperBerth;
      timeSpentInSleeperBerth += timeToStayInSleeperBerth;
      newLog.logbook.push({ hour: currentHour, row: "sleeper" });

      // **Start a New Day & Continue Logging (Recursive Call)**
      const nextDayLogs = autoFillLogbook(
        currentCycleHours,
        DurationFromCurrentLocationToPickup - totalTimeTraveled, // ✅ Remaining travel time to pickup
        totalTimeMinutes - totalTimeTraveled, // ✅ Remaining total trip time
        totalDistanceMiles,
        totalTimeTraveled, // ✅ Keep tracking time across days
        timeToStayInSleeperBerth
      );

      return [...logbooks, ...nextDayLogs]; // Combine all logbooks
    }
  }

  // **Step 8: On-Duty at Drop-off before Sleeping**
  newLog.logbook.push({ hour: currentHour, row: "on-duty" });
  console.log("Arrived at drop-off location");
  currentHour += 0.5;
  currentOnDutyHour += 0.5;
  timeSpentInOnDuty += 0.5;
  newLog.logbook.push({ hour: currentHour, row: "on-duty", action: "Drop-off" });

  // **Step 9: Switch to Sleeper Berth (End of the Trip)**
  newLog.logbook.push({ hour: currentHour, row: "sleeper" });
  console.log("Switching to sleeper berth");
  const timeToStayInSleeperBerth = 24 - currentHour;
  currentHour += timeToStayInSleeperBerth;
  timeSpentInSleeperBerth += timeToStayInSleeperBerth;
  newLog.logbook.push({ hour: currentHour, row: "sleeper" });

  newLog.timeSpentInOffDuty = timeSpentInOffDuty;
  newLog.timeSpentInOnDuty = timeSpentInOnDuty;
  newLog.timeSpentInDriving = timeSpentInDriving;
  newLog.timeSpentInSleeperBerth = timeSpentInSleeperBerth;

  return logbooks; // Return multiple days of logs
};
