import { useState } from "react";
import { Input } from "../../ui/input";
export const Search = () => {
  const [username, setUsername] = useState("");

  const handleSearch = async () => {};

  return (
    <div className="border-b border-solid border-gray-600">
      <div className="p-[10px]">
        <Input
          className="no-focus border-none bg-transparent text-white shadow-none outline-none placeholder:text-gray-300"
          type="text"
          placeholder="Find a follower..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
    </div>
  );
};
