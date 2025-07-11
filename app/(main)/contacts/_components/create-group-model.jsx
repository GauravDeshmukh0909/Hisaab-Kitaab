import React from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import * as z from 'zod';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { api } from '@/convex/_generated/api';
import { Popover } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandEmpty, CommandList, CommandGroup, CommandItem } from '@/components/ui/command';
import { X } from 'lucide-react';
import { useConvexMutation } from '@/hooks/use-convex-query';
import { toast } from 'sonner';
import { useConvexQuery } from '@/hooks/use-convex-query';
import { Input } from '@/components/ui/input';




const groupSchema = z.object({
    name: z.string().min(1, "Group name is required"),
    description: z.string().optional(),
});


const CreateGroupModal = ({ isOpen, isClose, onSuccess }) => {

    const [selectedMembers, setSelectedMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [commandOpen, setCommandOpen] = useState(false);



    const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

    const createGroup=useConvexMutation(api.contacts.createGroup);

    const { data: searchResults, isLoading: isSearching } = useConvexQuery(api.users.searchUsers, {
        query: searchQuery,
    }
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(groupSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const handleClose = () => {
        reset();
        setSelectedMembers([]);
        isClose();

    }

    const addMember = (user) => {
        if (!selectedMembers.some(member => member.id === user.id)) {
            setSelectedMembers([...selectedMembers, user]);
        }
        setCommandOpen(false);

    }
    const removeMember = (userId) => {
        setSelectedMembers(selectedMembers.filter(member => member.id !== userId));
    }

    const onSubmit = async (data) => {
    try {
      // Extract member IDs
      const memberIds = selectedMembers.map((member) => member.id);

      // Create the group
      const groupId = await createGroup.mutate({
        name: data.name,
        description: data.description,
        members: memberIds,
      });

      // Success
      toast.success("Group created successfully!");
      reset();
      setSelectedMembers([]);
      isClose();

      // Redirect to the new group page
      if (onSuccess) {
        onSuccess(groupId);
      }
    } catch (error) {
      toast.error("Failed to create group: " + error.message);
    }
  };



    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Group</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div className='space-y-2'>
                        <Label htmlFor="name" className="block mb-2">Group Name</Label>
                        <Input
                            id="name"
                            placeholder='Enter group name'
                            {...register("name")}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor="description" className="block mb-2">Description</Label>
                        <Textarea
                            id="description"
                            placeholder='Enter group description'
                            {...register("description")}
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>

                    <div className='space-y-2'>
                        <Label>Members</Label>
                        <div className='flex items-center gap-2 flex-wrap mb-2'>
                            {
                                currentUser && (
                                    <Badge variant={"secondary"} className="px-2 py-1">
                                        <Avatar className="h-5 w-5 mr-2">
                                            <AvatarImage src={currentUser.imageUrl} />
                                            <AvatarFallback>
                                                {currentUser.name.charAt(0) || "?"}
                                            </AvatarFallback>
                                        </Avatar>
                                        {currentUser.name}
                                    </Badge>
                                )
                            }

                            {/* selected members */}
                            {selectedMembers.map((member) => (
                                <Badge
                                    key={member.id}
                                    variant="secondary"
                                    className="px-3 py-1"
                                >
                                    <Avatar className="h-5 w-5 mr-2">
                                        <AvatarImage src={member.imageUrl} />
                                        <AvatarFallback>
                                            {member.name?.charAt(0) || "?"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>{member.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeMember(member.id)}
                                        className="ml-2 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}


                            {/* add user to selected members */}

                            <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size='sm'
                                        className="h-8 gap-1 text-xs"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        Add Members
                                    </Button>

                                </PopoverTrigger>
                                <PopoverContent className="p-0" align='start' side="bottom">
                                    <Command>
                                        <CommandInput placeholder="Search by name or email..."
                                            value={searchQuery}
                                            onValueChange={setSearchQuery}
                                        />
                                        <CommandList>
                                            <CommandEmpty>
                                                {searchQuery.length < 2 ? (
                                                    <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                                                        Type at least 2 characters to search
                                                    </p>
                                                ) : isSearching ? (
                                                    <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                                                        Searching...
                                                    </p>
                                                ) : (
                                                    <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                                                        No users found
                                                    </p>
                                                )}
                                            </CommandEmpty>
                                            <CommandGroup header="Users">
                                                {searchResults?.map((user) => (
                                                    <CommandItem
                                                        key={user.id}
                                                        value={user.name + user.email}
                                                        onSelect={() => addMember(user)}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarImage src={user.imageUrl} />
                                                                <AvatarFallback>
                                                                    {user.name?.charAt(0) || "?"}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm">{user.name}</span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {user.email}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </CommandItem>
                                                ))}

                                            </CommandGroup>
                                        </CommandList>
                                    </Command>

                                </PopoverContent>
                            </Popover>



                        </div>
                        {
                            selectedMembers.length === 0 && (
                                <p className="text-sm text-red-500 ">
                                    Add at least one member to the group.
                                </p>
                            )
                        }
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || selectedMembers.length === 0}
                        >
                            {isSubmitting ? "Creating..." : "Create Group"}
                        </Button>
                    </DialogFooter>

                </form>

            </DialogContent>
        </Dialog>
    )
}

export default CreateGroupModal;