import React, { useEffect } from "react";
import MyParkingAll from "./ParkingAll";
import { useState } from "react";
import Loading from "ui-component/back-drop/Loading";
import * as signalR from "@microsoft/signalr";

const ParkingAll = (props) => {
  const { businessId } = props;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = "https://parkzapi.azurewebsites.net/api";
  const token = localStorage.getItem("tokenAdmin");
  const signalRUrl = "https://parkzapi.azurewebsites.net/parkz";

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${signalRUrl}`)
      .build();

    connection
      .start()
      .then(() => console.log("Connection started!"))
      .catch((err) => console.error("Error: ", err));

    connection.on("LoadParkingInAdmin", () => {
      fetchData();
    });

    fetchData();

    return () => {
      connection.stop();
    };
  }, []);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `bearer ${token}`, // Replace `token` with your actual bearer token
      "Content-Type": "application/json", // Replace with the appropriate content type
    },
  };

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch(
      `${apiUrl}/parkings?managerId=${businessId}&pageNo=1&pageSize=11`,
      requestOptions
    );
    const data = await response.json();
    setRows(data.data);
    setLoading(false);
  };

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <>
      <MyParkingAll rows={rows} />
    </>
  );
};

export default ParkingAll;
