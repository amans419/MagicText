"use client";

import Authenticate from "@/components/authenticate"
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


const Register = () => {

    const router = useRouter();
    const { user } = useUser();
    const { session } = useSessionContext();

    useEffect(() => {
        if (user || session?.user) {
            router.push("/editor");
        }
    }, [user, session, router]);



    return (
        <div>
            <Authenticate />
        </div>
    )
}

export default Register;