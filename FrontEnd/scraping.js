const lessonLinks = Array.from(
  document.querySelectorAll("ytd-playlist-video-renderer #video-title")
)
  .filter((el) => /lesson/i.test(el.textContent)) // keep only titles with “Lesson”
  .slice(0, 25) // take the first 25 matches
  .map((el) => el.href);

console.log(lessonLinks.join("\n"));
