import { useState, useEffect } from 'react';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { json, LoaderFunction, ActionFunction, redirect } from '@remix-run/node';
import { db } from '~/utils/db.server';
import { requireAdmin } from '~/utils/session.server';
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';

export const loader: LoaderFunction = async ({ request }) => {
    const elections = await db.election.findMany({
        include: {
            candidates: true,
        },
    });

    return json({ elections });
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const action = formData.get('_action');

    switch (action) {
        case 'createElection': {
            const name = formData.get('name');
            const startTime = new Date(formData.get('startTime') as string);
            const endTime = new Date(formData.get('endTime') as string);

            if (typeof name !== 'string' || isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                return json({ error: 'Invalid form data' }, { status: 400 });
            }

            await db.election.create({
                data: {
                    name,
                    startTime,
                    endTime,
                },
            });

            return redirect('/elections');
        }
        case 'addCandidate': {
            const electionId = formData.get('electionId');
            const intraUsername = formData.get('intraUsername');

            if (typeof electionId !== 'string' || typeof intraUsername !== 'string') {
                return json({ error: 'Invalid form data' }, { status: 400 });
            }

            const token = await getAccessToken();
            const res = await fetch(`https://api.intra.42.fr/v2/users/${encodeURIComponent(intraUsername)}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                return json({ error: 'User not found' }, { status: 400 });
            }

            const user = await res.json();

            await db.candidate.create({
                data: {
                    electionId,
                    intraUsername: user.login,
                    profilePictureUrl: user.image.link,
                },
            });

            return redirect('/elections');
        }
        default:
            return json({ error: 'Invalid action' }, { status: 400 });
    }
};

export default function Elections() {
    const { elections } = useLoaderData();
    const [newElection, setNewElection] = useState({ name: '', startTime: '', endTime: '' });
    const [newCandidate, setNewCandidate] = useState({ electionId: '', intraUsername: '' });

    return (
        <div>
            <h1>Elections</h1>
            <div>
                <h2>Create Election</h2>
                <Form method="post">
                    <Input
                        type="text"
                        name="name"
                        placeholder="Election Name"
                        value={newElection.name}
                        onChange={(e) => setNewElection({ ...newElection, name: e.target.value })}
                    />
                    <Input
                        type="datetime-local"
                        name="startTime"
                        value={newElection.startTime}
                        onChange={(e) => setNewElection({ ...newElection, startTime: e.target.value })}
                    />
                    <Input
                        type="datetime-local"
                        name="endTime"
                        value={newElection.endTime}
                        onChange={(e) => setNewElection({ ...newElection, endTime: e.target.value })}
                    />
                    <Button type="submit" name="_action" value="createElection">
                        Create Election
                    </Button>
                </Form>
            </div>
            <div>
                <h2>Add Candidate</h2>
                <Form method="post">
                    <Input
                        type="text"
                        name="electionId"
                        placeholder="Election ID"
                        value={newCandidate.electionId}
                        onChange={(e) => setNewCandidate({ ...newCandidate, electionId: e.target.value })}
                    />
                    <Input
                        type="text"
                        name="intraUsername"
                        placeholder="Intra Username"
                        value={newCandidate.intraUsername}
                        onChange={(e) => setNewCandidate({ ...newCandidate, intraUsername: e.target.value })}
                    />
                    <Button type="submit" name="_action" value="addCandidate">
                        Add Candidate
                    </Button>
                </Form>
            </div>
            <div>
                <h2>Current Elections</h2>
                {elections.map((election) => (
                    <div key={election.id}>
                        <h3>{election.name}</h3>
                        <p>
                            Start Time: {new Date(election.startTime).toLocaleString()} <br />
                            End Time: {new Date(election.endTime).toLocaleString()}
                        </p>
                        <div>
                            <h4>Candidates</h4>
                            {election.candidates.map((candidate) => (
                                <div key={candidate.id}>
                                    <Link to={`https://profile.intra.42.fr/users/${candidate.intraUsername}`} target="_blank">
                                        <Avatar>
                                            <AvatarImage src={candidate.profilePictureUrl} />
                                            <AvatarFallback>{candidate.intraUsername.slice(0, 2)}</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <p>{candidate.intraUsername}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
