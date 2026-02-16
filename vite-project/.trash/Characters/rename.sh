#!/usr/bin/env sh

for file in *; do
    # Skip if it's a directory
    [ -d "$file" ] && continue
    
    # Skip special files
    if [ "$file" = "rename.sh" ] || [ "$file" = "metadata_template.json" ]; then
        continue
    fi
    
    # Get the filename with extension
    filename_with_ext="${file##*/}"
    # Get the file extension
    extension="${filename_with_ext##*.}"
    
    # Extract character name from filename
    # "Character Firefly Splash Art (hash).webp" -> "Firefly"
    name=$(echo "$filename_with_ext" | sed -E 's/Character (.*) Splash Art.*\..*/\1/')
    
    # Create directory
    mkdir -p "$name"
    
    # Copy image with simplified name
    image_filename="splash.${extension}"
    cp "$file" "$name/$image_filename"
    
    # Create metadata.json with populated fields
    cat > "$name/metadata.json" << EOF
{
    "name"    : "$name",
    "path"    : "$name",
    "gender"  : "@gender",
    "faction" : "@faction",
    "images"  : [
        { "file": "$image_filename", "type": "default" }
    ]
}
EOF
    
    echo "Created $name/"
done
