
export default function getUsername(user: any) {
  return user.user_metadata.username || user.user_metadata.user_name || user.user_metadata.full_name;
}
