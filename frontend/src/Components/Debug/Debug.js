import React from "react";

const Debug = data => {
    return (
        <pre>{JSON.stringify(data, null, 4)}</pre>
    );
}

export default Debug;