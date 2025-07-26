'use client'
export default function TopUsers() {
    return (
        <div className="shadow-lg shadow-gray-500/10 rounded-md p-3 border space-y-4 hidden md:block">
            <h1 className="text-xs font-bold text-gray-500">Top Users</h1>
            <div className="space-y-3">
                <div className="text-xs flex items-center justify-between text-gray-400">
                    <h1 className="font-medium ">Varun T</h1>
                    <p className="flex items-center gap-2">15.5k <TbArrowUp /></p>
                </div>

                <div className="text-xs flex items-center justify-between text-gray-400">
                    <h1 className="font-medium ">Himanshu P</h1>
                    <p className="flex items-center gap-2">5.5k <TbArrowUp /></p>
                </div>

                <div className="text-xs flex items-center justify-between text-gray-400">
                    <h1 className="font-medium ">Khushboo P</h1>
                    <p className="flex items-center gap-2">25.5k <TbArrowUp /></p>
                </div>
                <div className="text-xs flex items-center justify-between text-gray-400">
                    <h1 className="font-medium ">Deepanshu</h1>
                    <p className="flex items-center gap-2">1.5k <TbArrowUp /></p>
                </div>
            </div>
        </div>
    )
}
