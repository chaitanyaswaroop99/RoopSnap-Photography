import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'photos.json')

export function getPhotos() {
    try {
        if (!fs.existsSync(DB_PATH)) {
            return []
        }
        const fileContent = fs.readFileSync(DB_PATH, 'utf-8')
        return JSON.parse(fileContent)
    } catch (error) {
        console.error("Error reading photos DB:", error)
        return []
    }
}

export function savePhotos(photos: any[]) {
    try {
        // Ensure directory exists
        const dir = path.dirname(DB_PATH)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
        fs.writeFileSync(DB_PATH, JSON.stringify(photos, null, 2), 'utf-8')
        return true
    } catch (error) {
        console.error("Error writing photos DB:", error)
        return false
    }
}

const MESSAGES_DB_PATH = path.join(process.cwd(), 'src', 'data', 'messages.json')

export function getMessages() {
    try {
        if (!fs.existsSync(MESSAGES_DB_PATH)) {
            return []
        }
        const fileContent = fs.readFileSync(MESSAGES_DB_PATH, 'utf-8')
        return JSON.parse(fileContent)
    } catch (error) {
        console.error("Error reading messages DB:", error)
        return []
    }
}

export function saveMessages(messages: any[]) {
    try {
        const dir = path.dirname(MESSAGES_DB_PATH)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
        fs.writeFileSync(MESSAGES_DB_PATH, JSON.stringify(messages, null, 2), 'utf-8')
        return true
    } catch (error) {
        console.error("Error writing messages DB:", error)
        return false
    }
}
