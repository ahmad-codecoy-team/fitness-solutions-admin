# What to do next

ok still need small fixes, first of all you need to properly use VITE_IMAGE_URL in .env file. this should be the
base url for every image, so whereever rendering images, append this base url to properly render images. you can see
the example in users details page. update there as well. similarly in both trainers and trainees tables. then
clients table should properly show first intials CAPTALIZED. also remove small settings icon from status column of
clients table. also add proper navigation back and forth in trainer->trainer details->clients->client details pages.
make proper use of useNavigate. on client details page, add a trainer card as well, to show to trainer of that
specific client + a btn clicking on which takes to that client details page. update trainers table filter, remove
'inactive' from status dropdown. also we have old users data before updating backend, now old users don't have
status field at all, in those cases show theere status active, in status column of trainers table. then in exercises
table show the exercise type "general" if no type. then you need to add one more api endpoint in exercises. this is
to view exercise details. api endpoint is like this "/admin/exercises/694161f592a2dab35d833f6e" to fetch a specific
exercise. after api integration you also need to add ui for it. it's exact reponse structure you can see in this logs.md
file at the end of it saying "Get exercise by id response". also filter on exercises page, for exercise type, contains duplicate keys, remove them.

# Get exercise by id response

{
"data": {
"\_id": "694161f592a2dab35d833f6e",
"trainer": null,
"title": "X-Band Walk",
"description": "1. Keep your ribs down, abs tight and tailbone tucked between your knees. 2. Allow your shoulder blades to spread apart at the beginning as you cross your arms over. 3. Pull your hands back to your lower ribs, finishing with your shoulder blades locked inward and down. 4. Don't let your shoulder capsules shift forward at the finish of the movement.",
"video_link": "https://vimeo.com/124411705",
"pattern": [],
"type": [
"strength",
"cardio"
],
"primary_muscle": [],
"plane": [],
"photo": "",
"exercise_type": "general",
"\_\_v": 0,
"createdAt": "2025-12-16T13:43:17.579Z",
"updatedAt": "2025-12-18T09:31:48.620Z"
},
"meta": {}
}
