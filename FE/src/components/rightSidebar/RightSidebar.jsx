import People from "@mui/icons-material/People";
import { Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import CreatePost from "./CreatePost";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInProgressVacations,
  finishVacation,
} from "../../redux/slice/vacationSlice";
import axios from "axios";
import { DateCalendar } from "@mui/x-date-pickers";
import { DateRange } from "@mui/icons-material";
import dayjs from "dayjs";

function RightSidebar(props) {
  const user = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const { inProgressVacations, loading, error } = useSelector(
    (state) => state.vacation
  );
  const vacations = useSelector((state) => state.vacation.vacations);

  useEffect(() => {
    dispatch(fetchInProgressVacations());
  }, [dispatch, user]);

  useEffect(() => {
    dispatch(fetchInProgressVacations());
  }, [vacations]);

  const handleFinishVacation = (vacationId) => {
    dispatch(finishVacation(vacationId));
  };

  if (loading === "loading") {
    return (
      <div className="w-[360px] h-screen pr-3 pt-1 flex justify-center items-center top-0 sticky">
        <CircularProgress />
      </div>
    );
  }
  console.log(inProgressVacations)
  return (
    <>
      <div className="w-[360px] h-[1224px] pr-3 pt-1 flex-col justify-start items-center gap-4 inline-flex overflow-y-auto top-0 sticky">
        <div className="w-[348px] h-12 px-4 py-3 bg-gray-100 rounded-full justify-start items-start gap-4 inline-flex">
          <div className="w-6 h-6 relative" />
          <div className="grow shrink basis-0 text-slate-600 text-[15px] font-normal leading-tight">
            Search
          </div>
        </div>

        <div className="h-fit w-full px-4 py-[13px] bg-slate-200 rounded-2xl border border-gray-50 flex-col justify-start items-start gap-[25px] flex">
          <div className=" text-neutral-900 text-xl font-bold leading-normal">
            Your curent vacation
          </div>
            {inProgressVacations && inProgressVacations.length > 0 ? (
              <div className="w-full">
                {inProgressVacations.map((vacation) => (
                  <div
                    key={vacation._id}
                    className="rounded-2xl bg-white p-3 mb-4 hover:bg-slate-50"
                  >
                    <h1 className="text-sky-600 text-lg">{vacation.title}</h1>
                    <div className="flex gap-x-1">
                      <People />
                      <p>{vacation.participants.length} members</p>
                    </div>
                    <div className="flex gap-x-1">
                    <DateRange/>
                    {dayjs(vacation.startedAt).format("LL")}
                    </div>
                    <p className="">{vacation.desc}</p>
                    <div className="flex justify-around mt-3">
                      {vacation.createdBy._id===user.user._id&&<Button
                        className="w-[134px]"
                        variant="outlined"
                        color="error"
                        onClick={() => handleFinishVacation(vacation._id)}
                      >
                        Finish
                      </Button>}
                      <CreatePost vacationId={vacation._id} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="h-[80px] flex justify-center items-center text-slate-400">
                You don't have any vacation
              </p>
            )}
        </div>
      </div>
    </>
  );
}

export default RightSidebar;
