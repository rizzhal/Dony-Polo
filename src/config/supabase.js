import { createClient } from "@supabase/supabase-js";

let client;

function getStorageConfig() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secret = process.env.SUPABASE_SECRET_KEY;
    const bucket = process.env.SUPABASE_BUCKET;

    if (!url || !secret || !bucket) {
        throw new Error("Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, and SUPABASE_BUCKET to enable image uploads.");
    }

    return { url, secret, bucket };
}

function getClient() {
    if (!client) {
        const { url, secret } = getStorageConfig();
        client = createClient(url, secret, { auth: { persistSession: false } });
    }
    return client;
}

export async function uploadToStorage(filepath, buffer, contentType) {
    const { bucket } = getStorageConfig();
    const storage = getClient().storage.from(bucket);
    const { error } = await storage.upload(filepath, buffer, { contentType, upsert: false });
    if (error) throw error;

    const { data } = storage.getPublicUrl(filepath);
    return { path: filepath, url: data.publicUrl };
}

export async function deleteFromStorage(filepath) {
    const { bucket } = getStorageConfig();
    const { error } = await getClient().storage.from(bucket).remove([filepath]);
    if (error) console.error("Error deleting from storage", error.message);
}

export async function downloadFromStorage(filepath) {
    const { bucket } = getStorageConfig();
    const { data, error } = await getClient().storage.from(bucket).download(filepath);
    if (error) throw error;
    return data
}

export async function createSignedUrl(filepath, expiresIn = 3600) {
    const { bucket } = getStorageConfig();
    const { data, error } = await getClient().storage.from(bucket).createSignedUrl(filepath, expiresIn);
    if (error) throw error;
    return data.signedUrl
}