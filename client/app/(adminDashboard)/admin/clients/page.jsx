"use client";

import MessageBox from "@/app/components/MessageBox/MessageBox";
import apiRequest from "@/app/lib/apiRequest";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, Spinner, Table } from "react-bootstrap";

function AdminClientsDashboard() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const CloseMB = () => {
    setMessage(null);
  };

  const CreateMessageBox = (Item_ID, Item_Name) => {
    setMessage({
      item_id: Item_ID,
      text: `Are You Sure You Want To Delete ${Item_Name}`,
      noFunction: CloseMB,
      yesFunction: () => DeleteAccount(Item_ID),
    });
  };

  const DeleteAccount = async (id) => {
    try {
      const result = await apiRequest.delete(`/user/${id}`);

      toast.success(result.data.message, {
        position: "top-right",
        autoClose: 1000,
        theme: "light",
      });
    } catch (err) {
      console.log(err.message);
    } finally {
      CloseMB();
      GetClients();
    }
  };

  const GetClients = async () => {
    try {
      const res = await apiRequest.get("/user/clients");
      setClients(res.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetClients();
  }, []);

  return (
    <>
      {message && <MessageBox message={message} />}
      <h1 className="lead secondary">Clients</h1>
      <hr></hr>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          {clients.length > 0 ? (
            <div className="table-responsive-sm overflow-x-scroll">
              <Table>
                <thead>
                  <tr>
                    <th className="bgPrimary text-white">#</th>
                    <th className="bgPrimary text-white">Username</th>
                    <th className="bgPrimary text-white">E-mail</th>
                    <th className="bgPrimary text-white">Assigned Coach</th>
                    <th className="bgPrimary text-white">
                      Active Subscription
                    </th>
                    <th className="bgPrimary text-white">Operations</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client, index) => {
                    if (client.isAdmin) {
                      return;
                    }

                    return (
                      <tr className="text-nowrap" key={index}>
                        <td>{client._id}</td>
                        <td>{client.username}</td>
                        <td>{client.email}</td>
                        <td>
                          {client.assignedCoachId
                            ? client.assignedCoachId
                            : "-"}
                        </td>
                        <td>
                          {client.activeSubscription
                            ? client.activeSubscription
                            : "-"}
                        </td>
                        <td className="d-flex justify-content-center">
                          {client.activeSubscription && (
                            <>
                              {!client.assignedCoachId && (
                                <Button
                                  onClick={() => {
                                    router.push(
                                      `/admin/clients/assignCoach/${client._id}`
                                    );
                                  }}
                                  className="me-2"
                                  variant="success"
                                >
                                  📝
                                </Button>
                              )}
                            </>
                          )}

                          <Button
                            variant="danger"
                            onClick={() =>
                              CreateMessageBox(client._id, client.username)
                            }
                          >
                            🗑️
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          ) : (
            <h3>No Clients Found!</h3>
          )}
        </>
      )}
    </>
  );
}

export default AdminClientsDashboard;
