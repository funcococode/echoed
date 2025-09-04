'use client'

import { useEffect, useMemo, useState, useDeferredValue } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { TbArrowRight, TbPlus, TbSearch, TbWaveSquare } from 'react-icons/tb'
import { TbLayoutGrid, TbListDetails } from 'react-icons/tb'
import { listChambers, type ChamberType } from '@/actions/chambers'
import CreateChamberModal from './_components/create-chamber'
import PageHeading from '@/components/ui/page-heading'
import useNavigationStore from '@/stores/navigation-store'
import Button from '@/components/form/button'
import Icon from '@/components/ui/icon'
import { SelectInput } from '@/components/form/select-input'
import { Input } from '@/components/ui/input'

type Chamber = ChamberType extends Array<infer T> ? T : never

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 240, damping: 20 } },
}

export default function Chambers() {
  const [data, setData] = useState<ChamberType>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'az' | 'za'>('az')

  const deferredQuery = useDeferredValue(query)
  const { currentPath } = useNavigationStore()

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await listChambers({})
      setData(response)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [])

  const handleOnClose = () => {
    setShowModal(false)
    void fetchData()
  }

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    let rows = q
      ? data.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.description ?? '').toLowerCase().includes(q) ||
          (c.frequency ?? '').toLowerCase().includes(q),
      )
      : data

    rows = [...rows].sort((a, b) =>
      sort === 'az' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
    )

    return rows
  }, [data, deferredQuery, sort])

  return (
    <section className="flex gap-4">
      <div className="flex-[3] space-y-4">
        {/* Header */}
        <PageHeading>
          <section className="flex h-32 items-center justify-between gap-4 px-4">
            <div className="flex w-1/3 items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary/25 to-fuchsia-500/10 blur-sm opacity-60 dark:opacity-40" />
                <div className="relative grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white text-black dark:bg-neutral-900 dark:text-white">
                  {currentPath.icon}
                </div>
              </div>
              <div className="leading-tight">
                <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Chambers
                </div>
                <div className="text-3xl font-extralight tabular-nums">
                  {loading ? '—' : filtered.length}
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-1 items-center justify-end gap-3">
              <div className="relative hidden min-w-[220px] items-center sm:flex">
                <TbSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search chambers…"
                  aria-label="Search chambers"
                  className="w-full rounded-md border border-black/10 bg-white px-9 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 hover:border-black/20 focus:border-black/30 focus:outline-none dark:border-white/10 dark:bg-neutral-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:hover:border-white/20 dark:focus:border-white/30"
                />
              </div>

              <SelectInput
                options={[
                  {
                    value: 'az', label: 'A → Z'
                  },
                  {
                    value: 'za', label: 'Z → A'
                  }
                ]}
                onChange={value => setSort(value)}
                label='Sort'
                placeholder='Sort Chambers'
              />

              <div className="hidden items-center gap-2 sm:flex">
                <div
                  role="group"
                  aria-label="Toggle view"
                  className="inline-flex overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900"
                >
                  <button
                    type="button"
                    aria-pressed={view === 'grid'}
                    onClick={() => setView('grid')}
                    className={`px-3 py-2 text-sm transition ${view === 'grid'
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-gray-600 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/5'
                      }`}
                    title="Grid view"
                  >
                    <TbLayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-pressed={view === 'list'}
                    onClick={() => setView('list')}
                    className={`px-3 py-2 text-sm transition ${view === 'list'
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-gray-600 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/5'
                      }`}
                    title="List view"
                  >
                    <TbListDetails className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <Button
                text="Create new chamber"
                icon={<TbPlus className="text-xl" />}
                onClick={() => setShowModal(true)}
                classNames="py-2 rounded-md font-semibold bg-black dark:bg-white dark:text-black"
              />
            </div>
          </section>
        </PageHeading>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length ? (
          view === 'grid' ? (
            <motion.ul
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-5"
            >
              {filtered.map((c) => (
                <motion.li key={c.id} variants={itemVariant(c)}>
                  <ChamberCard chamber={c} />
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.ul
              variants={container}
              initial="hidden"
              animate="show"
              className="divide-y divide-neutral-100 rounded border border-neutral-100  bg-white dark:divide-white/10 dark:border-white/10 dark:bg-neutral-900 mt-5"
            >
              {filtered.map((c) => (
                <motion.li key={c.id} variants={itemVariant(c)}>
                  <ChamberRow chamber={c} />
                </motion.li>
              ))}
            </motion.ul>
          )
        ) : (
          <EmptyState onCreate={() => setShowModal(true)} />
        )}


        {showModal && <CreateChamberModal onClose={handleOnClose} />}
      </div>
    </section>
  )
}

/* ---------- UI Pieces ---------- */

function formatFrequency(freq?: string) {
  if (!freq) return null
  const base = freq.split('-')[0]
  return base.charAt(0).toUpperCase() + base.slice(1)
}

function itemVariant(_c: Chamber) {
  return item
}

function ChamberCard({ chamber }: { chamber: Chamber }) {
  const freq = formatFrequency(chamber.frequency)

  return (
    <Link
      href={`/chambers/${chamber.id}`}
      className="group relative block overflow-hidden rounded border border-neutral-200 bg-white transition duration-300 dark:border-white/10 dark:bg-neutral-900 h-32"
    >
      {/* Subtle hover accent */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-fuchsia-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Content (extra bottom padding to make room for the action bar) */}
      <div className="relative z-20 flex h-full flex-col gap-3 p-5 pb-12 ">
        <div className="flex items-center justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold text-gray-800 transition-colors group-hover:text-primary dark:text-neutral-100">
            {chamber.name}
          </h3>

        </div>

        <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          {chamber.description}
        </p>
      </div>

      {/* Bottom action bar (slides up on hover; does NOT overlap title) */}
      <div className="absolute inset-x-0 bottom-0 z-30 translate-y-full transition-transform duration-300 group-hover:translate-y-0 ">
        <div className="flex items-center justify-between border-t border-black/10 bg-white/80 px-5 py-2.5 text-xs backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/80">
          <span className="flex items-center gap-1 text-primary dark:text-neutral-200">
            <TbArrowRight className="h-4 w-4" />
            View
          </span>

          {freq && (
            <span className="ml-2 inline-flex items-center rounded-full border border-black/10 px-2 py-0.5 text-[10px] text-success dark:border-white/10 dark:text-gray-300">
              <TbWaveSquare className="text-[14px]" />
              {freq}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}


function SkeletonCard() {
  return (
    <div className="h-[152px] animate-pulse rounded-xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
      <div className="mb-4 h-4 w-1/2 rounded bg-black/10 dark:bg-white/10" />
      <div className="mb-2 h-3 w-full rounded bg-black/10 dark:bg-white/10" />
      <div className="mb-2 h-3 w-5/6 rounded bg-black/10 dark:bg-white/10" />
      <div className="h-3 w-2/3 rounded bg-black/10 dark:bg-white/10" />
    </div>
  )
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-black/15 bg-white/50 p-10 text-center dark:border-white/10 dark:bg-neutral-950/60">
      <div className="mb-6">
        <Icon icon={<TbPlus />} size="large" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">No chambers yet</h3>
      <p className="mb-6 max-w-md text-sm text-gray-500 dark:text-gray-400">
        Create your first chamber to start organizing echoes by topic, frequency, or team.
      </p>
      <Button
        text="Create new chamber"
        icon={<TbPlus className="text-xl" />}
        onClick={onCreate}
        classNames="py-3 font-semibold bg-black dark:bg-white dark:text-black"
      />
    </div>
  )
}
function ChamberRow({ chamber }: { chamber: Chamber }) {
  const freq = formatFrequency(chamber.frequency)

  return (
    <Link
      href={`/chambers/${chamber.id}`}
      className="flex items-center justify-between gap-4 p-4 transition hover:bg-black/5 dark:hover:bg-white/5"
    >
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-gray-800 dark:text-neutral-100">
          {chamber.name}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
          {chamber.description}
        </p>
      </div>

      <div className="ml-4 flex shrink-0 items-center gap-3">
        {freq && (
          <span className="inline-flex items-center rounded-full border border-black/10 px-2 py-0.5 text-[10px] text-gray-600 dark:border-white/10 dark:text-gray-300">
            {freq}
          </span>
        )}
        <TbArrowRight className="h-5 w-5 text-primary/80" />
      </div>
    </Link>
  )
}
