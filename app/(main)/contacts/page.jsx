"use client";

import { api } from "@/convex/_generated/api"
import { useConvexQuery } from "@/hooks/use-convex-query"
import React from 'react'
import { BarLoader } from "react-spinners"
import { Button } from "@/components/ui/button";
import { Plus, User, Users } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter,useSearchParams } from "next/navigation";
import CreateGroupModal from "./_components/create-group-model";
import { useEffect } from "react";


const ContactPage = () => {
  const [ isCreateGroupMode, setIsCreateGroupMode ] = useState(false);
  const { data, isLoading, error } = useConvexQuery(api.contacts.getContacts);

  const router = useRouter();

   const searchParams = useSearchParams();

   // Check for the createGroup parameter when the component mounts
  useEffect(() => {
    const createGroupParam = searchParams.get("createGroup");

    if (createGroupParam === "true") {
      // Open the modal
      setIsCreateGroupMode(true);

      // Remove the parameter from the URL
      const url = new URL(window.location.href);
      url.searchParams.delete("createGroup");

      // Replace the current URL without the parameter
      router.replace(url.pathname + url.search);
    }
  }, [searchParams, router]);


  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <BarLoader width={100} color="#4A90E2" />
      </div>
    )
  }

  const { users, groups } = data || { users: [], groups: [] };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-5xl gradient-title">Contacts</h1>
        <Button className="mb-4" onClick={() => setIsCreateGroupMode(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Group
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <User className="mr-2 h-5 w-5" />
            People
          </h2>

          {
            users.length === 0 ? (
              <Card>
                <CardContent className={"py-6 text-center text-mutated-foreground"}>
                  No contacts yet. Add an expense with someone to see them here.
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-4">
                {users.map((user) => (
                  <Link key={user.id} href={`/person/${user.id}`}>
                    <Card className="hover:bg-muted/30 transition-colors cursor-pointer">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.imageUrl} />
                              <AvatarFallback>
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )
          }
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Groups
          </h2>
          {groups.length === 0 ? (
            <Card>
              <CardContent className="py-6 text-center text-muted-foreground">
                No groups yet. Create a group to start tracking shared expenses.
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {groups.map((group) => (
                <Link key={group.id} href={`/groups/${group.id}`}>
                  <Card className="hover:bg-muted/30 transition-colors cursor-pointer">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-md">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{group.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {group.memberCount} members
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>

      <CreateGroupModal
        isOpen={isCreateGroupMode}
        isClose={() => setIsCreateGroupMode(false)}
        onSuccess={(groupId) => { 
          router.push(`/groups/${groupId}`);
        }}
      />
    </div>
  )
}

export default ContactPage