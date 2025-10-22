import React, { useState } from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {TFunction} from "@sinclair/typebox";

type Member = {
    id: string;
    username: string;
};

type Props = {
    style: any;
    selectedMember: Member | null;
    setSelectedMember: (member: Member | null) => void;
    members: Member[];
};

export default function MemberPicker({ members, style, setSelectedMember, selectedMember }: Props) {

    if (!members || members.length === 0) {
        return null;
    }

    return (
        <View>
            <Picker
                style={style}
                selectedValue={selectedMember?.id}
                onValueChange={(value) => {
                    const member = members.find((m) => m.id === value);
                    setSelectedMember(member || null);
                }}
            >
                {members.map((member) => (
                    <Picker.Item
                        key={member.id}
                        label={member.username}
                        value={member.id}
                    />
                ))}
            </Picker>
        </View>
    );
}