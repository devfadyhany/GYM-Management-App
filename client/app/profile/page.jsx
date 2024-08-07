"use client";

import { AuthContext } from "@/app/context/AuthContext";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Row, Spinner } from "react-bootstrap";
import apiRequest from "../lib/apiRequest";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";

function ProfilePage() {
  const { currentUser, UpdateUser } = useContext(AuthContext);
  const [subscription, setSubscription] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newUsername, setNewUsername] = useState("");

  const GetSubscriptionDetails = async () => {
    try {
      const res = await apiRequest.get(
        `/subscription/${currentUser.activeSubscription}`
      );

      setSubscription(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const ChangeUsername = async () => {
    try {
      let newUser = currentUser;
      newUser.username = newUsername;

      await apiRequest.put(`/user/${currentUser._id}`, newUser);

      setEditMode(false);

      UpdateUser((prev) => {
        return { ...prev, username: newUsername };
      });
    } catch (err) {
      toast.error(err.message, {
        position: "top-right",
        autoClose: 1000,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    if (currentUser !== null) {
      GetSubscriptionDetails();
      setNewUsername(currentUser.username);
    }
  }, [currentUser]);

  return (
    <div>
      <Container className="py-5">
        {currentUser ? (
          <Row className="gap-5 align-items-center">
            <div className="col-12 col-lg-7">
              <div
                style={{ backgroundColor: "var(--mainColor)" }}
                className="border border-5 rounded p-3"
              >
                <h1>Account Info</h1>
                <br></br>
                <h3 className="primary">
                  Username:{" "}
                  <span className="secondary">
                    <>
                      {editMode ? (
                        <>
                          <input
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="me-3"
                            type="text"
                          />
                          <Button onClick={ChangeUsername} variant="success">
                            ✅
                          </Button>
                        </>
                      ) : (
                        <>
                          {currentUser.isCoach
                            ? `Coach.${currentUser.username}`
                            : currentUser.username}
                        </>
                      )}
                    </>
                  </span>
                </h3>
                <h3 className="primary">
                  E-mail: <span className="secondary">{currentUser.email}</span>
                </h3>
                <br></br>
                <Button onClick={() => setEditMode(true)} variant="success">
                  Change Username
                </Button>
              </div>

              <div
                style={{ backgroundColor: "var(--mainColor)" }}
                className="border border-5 rounded p-3 mt-3"
              >
                <h1>Subscription Details</h1>
                <br></br>
                {loading ? (
                  <Spinner animation="border" />
                ) : (
                  <>
                    {subscription ? (
                      <>
                        <h3 className="primary">
                          id:{" "}
                          <span className="secondary">{subscription._id}</span>
                        </h3>
                        <h3 className="primary">
                          Start-Date:{" "}
                          <span className="secondary">
                            {subscription.createdAt}
                          </span>
                        </h3>
                        <h3 className="primary">
                          End-Date:{" "}
                          <span className="secondary">
                            {subscription.endAt}
                          </span>
                        </h3>
                        <h3 className="primary">
                          Plan-Type:{" "}
                          <span className="secondary">
                            {subscription.planType}
                          </span>
                        </h3>
                      </>
                    ) : (
                      <h3>Your are not subscribed yet!</h3>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="d-flex flex-column justify-content-center align-items-center gap-5">
                <CldImage
                  width="400"
                  height="600"
                  className="rounded w-50 h-auto "
                  src={currentUser.avatar || "GYM-Management-System/d_avatar"}
                  alt="User Avatar"
                  priority
                />

                <QRCode value={currentUser._id} />
              </div>
            </div>
          </Row>
        ) : (
          <>
            <h1>You Must Login First</h1>
            <Link href="/login">go to login page.</Link>
          </>
        )}
      </Container>
    </div>
  );
}

export default ProfilePage;
