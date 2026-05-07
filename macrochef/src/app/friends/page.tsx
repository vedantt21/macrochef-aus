"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/Button";
import { Card, CardHeader } from "@/components/Card";
import FriendRequestCard from "@/components/FriendRequestCard";

type Member = { id: string; displayName: string; username: string; isFriend?: boolean };
type Incoming = { id: string; sender: Member; createdAt: string };
type Outgoing = { id: string; receiver: Member; createdAt: string };

export default function FriendsPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Member[]>([]);
  const [friends, setFriends] = useState<Member[]>([]);
  const [incoming, setIncoming] = useState<Incoming[]>([]);
  const [outgoing, setOutgoing] = useState<Outgoing[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    const [friendsResponse, incomingResponse, outgoingResponse] = await Promise.all([
      fetch("/api/friends"),
      fetch("/api/friends/requests/incoming"),
      fetch("/api/friends/requests/outgoing"),
    ]);
    if (friendsResponse.ok) setFriends((await friendsResponse.json()).friends);
    if (incomingResponse.ok) setIncoming((await incomingResponse.json()).requests);
    if (outgoingResponse.ok) setOutgoing((await outgoingResponse.json()).requests);
  }

  useEffect(() => {
    load();
  }, []);

  async function search(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    const response = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`);
    const data = await response.json();
    if (response.ok) setResults(data.users);
  }

  async function send(receiverId: string) {
    const response = await fetch("/api/friends/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId }),
    });
    const data = await response.json();
    setMessage(response.ok ? "Friend request sent." : data.error || "Unable to send request.");
    load();
  }

  async function act(id: string, action: "accept" | "reject") {
    await fetch(`/api/friends/requests/${id}/${action}`, { method: "POST" });
    load();
  }

  async function remove(userId: string) {
    await fetch(`/api/friends/${userId}`, { method: "DELETE" });
    load();
  }

  return (
    <AppShell>
      <div className="grid gap-6">
        <div>
          <p className="text-sm font-bold uppercase text-emerald-300">Friends</p>
          <h1 className="mt-2 text-3xl font-black text-white">Find members and manage requests</h1>
        </div>

        <Card>
          <CardHeader title="Search verified members" eyebrow="Add" />
          <form onSubmit={search} className="flex flex-col gap-3 sm:flex-row">
            <input
              className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-white outline-none focus:border-emerald-400"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Search by username or display name"
            />
            <Button>Search</Button>
          </form>
          {message ? <p className="mt-3 rounded-lg bg-zinc-900 p-3 text-sm text-emerald-200">{message}</p> : null}
          <div className="mt-4 grid gap-3">
            {results.map((member) => (
              <div key={member.id} className="flex flex-col justify-between gap-3 rounded-lg bg-zinc-900 p-4 sm:flex-row sm:items-center">
                <div>
                  <p className="font-semibold text-white">{member.displayName}</p>
                  <p className="text-sm text-zinc-400">@{member.username}</p>
                </div>
                <Button variant="secondary" disabled={member.isFriend} onClick={() => send(member.id)}>
                  {member.isFriend ? "Already friends" : "Send request"}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title="Incoming requests" eyebrow={`${incoming.length} pending`} />
            <div className="grid gap-3">
              {incoming.length ? incoming.map((request) => (
                <FriendRequestCard
                  key={request.id}
                  user={request.sender}
                  onAccept={() => act(request.id, "accept")}
                  onReject={() => act(request.id, "reject")}
                />
              )) : <p className="rounded-lg bg-zinc-900 p-5 text-sm text-zinc-400">No incoming requests.</p>}
            </div>
          </Card>

          <Card>
            <CardHeader title="Outgoing requests" eyebrow={`${outgoing.length} pending`} />
            <div className="grid gap-3">
              {outgoing.length ? outgoing.map((request) => <FriendRequestCard key={request.id} user={request.receiver} meta="pending" />) : <p className="rounded-lg bg-zinc-900 p-5 text-sm text-zinc-400">No outgoing requests.</p>}
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader title="Friends list" eyebrow={`${friends.length} friends`} />
          <div className="grid gap-3">
            {friends.length ? friends.map((friend) => <FriendRequestCard key={friend.id} user={friend} onRemove={() => remove(friend.id)} />) : <p className="rounded-lg bg-zinc-900 p-5 text-sm text-zinc-400">No friends yet.</p>}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
