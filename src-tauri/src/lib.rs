use image::ImageFormat;
use std::io::Cursor;
use base64::{Engine as _, engine::general_purpose};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn convert_image(image_data: String, target_format: String) -> Result<String, String> {
    let data = general_purpose::STANDARD
        .decode(image_data)
        .map_err(|e| e.to_string())?;

    let img = image::load_from_memory(&data).map_err(|e| e.to_string())?;

    let format = match target_format.to_lowercase().as_str() {
        "png" => ImageFormat::Png,
        "jpeg" | "jpg" => ImageFormat::Jpeg,
        "webp" => ImageFormat::WebP,
        "tiff" => ImageFormat::Tiff,
        "bmp" => ImageFormat::Bmp,
        "gif" => ImageFormat::Gif,
        _ => return Err(format!("Unsupported format: {}", target_format)),
    };

    let mut buffer = Cursor::new(Vec::new());
    img.write_to(&mut buffer, format).map_err(|e| e.to_string())?;

    let encoded = general_purpose::STANDARD.encode(buffer.into_inner());
    Ok(encoded)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, convert_image])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
