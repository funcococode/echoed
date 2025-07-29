'use client'

import { listChambers, type ChamberType } from "@/actions/chambers";
import Icon from "@/components/ui/icon";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TbArrowRight, TbPlus, TbWaveSquare } from "react-icons/tb";
import CreateChamberModal from "./_components/create-chamber";
import PageHeading from "@/components/ui/page-heading";
import useNavigationStore from "@/stores/navigation-store";
import Button from "@/components/form/button";

export default function Chambers() {
  const [data, setData] = useState<ChamberType>([])
  const [showModal, setShowModal] = useState(false);
  const { currentPath } = useNavigationStore()

  const fetchData = async () => {
    const response = await listChambers();
    setData(response)
  }

  useEffect(() => {
    fetchData().catch(err => console.log(err));
  }, [])

  const handleOnClose = () => {
    setShowModal(false)
    fetchData().catch(err => console.log(err))
  }

  return (
    <section className="flex gap-4 ">
      <div className="space-y-4 flex-[3]">
        <PageHeading>
          <section className='h-32 flex items-center justify-between px-4 gap-1 '>
            <div className='w-1/4 text-5xl flex justify-start gap-4 items-center text-secondary'>
              {currentPath.icon}
              <span className="font-extralight">{data.length}</span>
            </div>
            <div className='flex-1 flex items-center justify-end '>
              <Button
                text="Create new chamber"
                icon={<TbPlus className="text-xl " />}
                onClick={() => setShowModal(true)}
                classNames="py-3 font-semibold bg-black"
              />
            </div>
          </section>
        </PageHeading>
        <div className="grid md:grid-cols-4 gap-4">
          {data?.map(item => <Link href={`/chambers/${item.id}`} className='group relative overflow-hidden hover:ring hover:ring-primary/20 hover:bg-primary/5 transition  rounded shadow shadow-gray-400/10 border border-secondary' key={item.id}>
            <div className='text-gray-300 text-xs font-semibold flex items-start gap-3 justify-between absolute inset-0 z-0 p-3'>
              <p className="text-primary invisible group-hover:visible transition-all translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100 flex items-center gap-1">
                <TbArrowRight />
                View
              </p>
              {!!item.frequency && <p className="hover:text-teal-400 flex items-center gap-1 transition-all scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100">
                <TbWaveSquare />
                {item.frequency.split('-')[0]}
              </p>}
            </div>
            <div className="relative z-10 h-full group-hover:shadow-lg group-hover:scale-95 group-hover:translate-y-10 space-y-4 list-none p-5 flex flex-col justify-start overflow-hidden transition-all bg-white rounded-md">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm text-gray-700 flex justify-between group-hover:text-primary">
                  <p>{item.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs gap-2 text-gray-400">
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          </Link>)}
        </div>
        {!data.length && <button onClick={() => setShowModal(true)} className="flex-1 border w-full h-96 rounded-md border-gray-200 bg-gray-50 capitalize font-semibold grid place-content-center gap-5 hover:bg-gray-100">
          <Icon icon={<TbPlus />} size="large" />
          Create new Chamber
        </button>}
        {showModal && <CreateChamberModal onClose={handleOnClose} />}
      </div>
      {/* {!!data.length && <aside className='flex-1 order-2'>
        <RightSidebar>
          <Button
            text="New chamber"
            icon={<TbPlus className="text-xl " />}
            onClick={() => setShowModal(true)}
            classNames="py-4 font-semibold "
          />
        </RightSidebar>
      </aside>} */}
    </section>
  )
}
