import Image from "next/image";
import logo from "@/assets/logos/logo-base-256x256.png"

export default function Logo() {
    return (
        <Image width={30} height={30} src={logo} alt="Echoed Logo" />
    )
}
