'use client'

import EchoLoader from "@/components/ui/loaders/loader"
import useNavigationStore from "@/stores/navigation-store"

export default function Loader() {
    const { isChangingPath } = useNavigationStore()
    return (
        isChangingPath ? <EchoLoader overlay /> : null
    )
}
