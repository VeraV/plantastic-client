export const ProfilePage = () => {
  async function shareShoppingList() {
    const shoppingItems = ["Milk", "Eggs", "Bananas"];
    const text = shoppingItems.join("\n"); // each item on its own line

    if (navigator.share) {
      try {
        console.log("Share sheet opened");
        await navigator.share({
          text,
        });
        console.log("After!");
      } catch (err) {
        console.error("Share failed:", err);
        // fallback -> download file
        downloadTextFile("shopping-list.txt", text);
      }
    } else {
      // Fallback: download .txt (user can open it on phone or copy)
      downloadTextFile("shopping-list.txt", text);
    }
  }

  function downloadTextFile(filename, text) {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <h1>Profile Page</h1>
      <button onClick={shareShoppingList}>Export</button>
    </>
  );
};
