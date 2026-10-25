export function timeAgo(iso: string, now: number = Date.now()) {
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60000);

  if (minutes < 1) return "agora mesmo";
  if (minutes < 60) return `há ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} h`;

  return `há ${Math.floor(hours / 24)} d`;
}
