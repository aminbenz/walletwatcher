export default function RoleBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-sm px-2 py-1 text-xs ${
        status === 'IN_ACTIVE'
          ? 'bg-purple-700 text-white'
          : status === 'ADMIN'
          ? 'bg-yellow-500 text-white'
          : status === 'ACTIVE'
          ? 'bg-green-500 text-white'
          : status === 'BANNED'
          ? 'bg-pink-500 text-white'
          : status === 'TECHNICIAN'
          ? 'bg-blue-500 text-white'
          : 'bg-gray-700 text-white'
      }`}
    >
      {status}
    </span>
  );
}
