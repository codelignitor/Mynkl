import { useState, useEffect } from 'react';

export interface Hug {
    id: string;
    sender: string;
    message: string;
    timestamp: number;
}

export function useHugs() {
    const [hugs, setHugs] = useState<Hug[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    return { hugs, loading,  };
}