// Vygoatsky plaque for 3D printing with a layer-based filament swap
// Slice with a color change at Z = base_thickness to print the text in a second color.

$fn = 64;

// --- Dimensions (mm)
plaque_width      = 220;
plaque_height     = 180;
base_thickness    = 2;   // height of the base layer(s); set color change above this
text_height       = 2.0;   // height of embossed text above base
border_height     = 2.6;   // height of border ring (double text height)
border_inset      = 2.5;   // distance from edge
border_width      = 0.5;   // thickness of border ring
corner_radius     = 6;
margin            = 14;
second_gap        = 5;
// --- Typography
// Use fonts installed on your system. On macOS, "Times New Roman" is common.
// If the chosen fonts are unavailable, change to available ones (e.g., "DejaVu Sans").
title_text        = "VYGOATSKY";
title_size        = 18;
title_font        = "Raleway:style=Bold";
title_height      = 2.6;

// Poem lines as separate variables (three cycles)
// Cycle 1: forge → worship → groupthink → turn
line1 = "We forge our gods from borrowed gold,";
line2 = "Ornate their claims, belief takes hold.";
line3 = "Alone we bleat, then together forge gnosis -";
line4 = "Praise, crown, dogmatic as we share hypnosis.";

// Cycle 2: devotion → dissolution → flaking → breaking
line5 = "In proximal zones of bright devotion,";
line6 = "Truth dissolves in pure emotion.";
line7 = "Till Gold flakes off -  one sows its cracks,";
line8 = "We gild to cast, the herd attacks.";

// Cycle 3: lone voice → illusion collapses → scapegoat → void → new forge
line9 = "One lone boy's call - the crowd's untruth:";
line10 = "What was set in stone is now uncouth.";
line11 = "As worship fails and panic spins,";
line12 = "The goat is scaped, shot messenger is.";


body_size         = 8;  // slightly smaller to fit better
body_font         = "Raleway:style=Regular";
line_spacing      = 12.5;  // tighter vertical spacing
left_margin       = -100;  // left-align text (negative for left of center)

// Starting position for first line (below title)
first_line_y      = 52;

// --- Geometry helpers
module rounded_rect(w, h, r) {
  // Centered rounded rectangle using offset
  offset(r = r) square([w - 2*r, h - 2*r], center = true);
}

module plaque_base() {
  linear_extrude(height = base_thickness)
    rounded_rect(plaque_width, plaque_height, corner_radius);
}

module border_ring() {
  // Create raised border ring by difference of two rounded rectangles
  translate([0, 0, base_thickness])
    linear_extrude(height = border_height)
      difference() {
        // Outer rectangle
        rounded_rect(plaque_width - 2 * border_inset, 
                     plaque_height - 2 * border_inset, 
                     corner_radius - border_inset);
        // Inner rectangle (subtract to create ring)
        rounded_rect(plaque_width - 2 * border_inset - 2 * border_width, 
                     plaque_height - 2 * border_inset - 2 * border_width, 
                     corner_radius - border_inset - border_width);
      }
}

module emboss_text(txt, size, font, pos, align="center") {
  translate([pos[0], pos[1], base_thickness])
    linear_extrude(height = text_height)
      text(txt, size = size, font = font, halign = align, valign = "center");
}

module plaque() {
  union() {
    plaque_base();
    border_ring();  // Add raised border

    // Title near the top edge, centered
    emboss_text(title_text, title_size, title_font,
                [0, plaque_height/2 - margin - title_height/2], "center");

    // Body text - each line separately, left-aligned
    // Cycle 1
    emboss_text(line1, body_size, body_font, [left_margin, first_line_y], "left");
    emboss_text(line2, body_size, body_font, [left_margin, first_line_y - line_spacing], "left");
    emboss_text(line3, body_size, body_font, [left_margin, first_line_y - line_spacing * 2], "left");
    emboss_text(line4, body_size, body_font, [left_margin, first_line_y - line_spacing * 3], "left");
    
    // Cycle 2
    emboss_text(line5, body_size, body_font, [left_margin, first_line_y - line_spacing * 4 - second_gap], "left");
    emboss_text(line6, body_size, body_font, [left_margin, first_line_y - line_spacing * 5 - second_gap], "left");
    emboss_text(line7, body_size, body_font, [left_margin, first_line_y - line_spacing * 6 - second_gap], "left");
    emboss_text(line8, body_size, body_font, [left_margin, first_line_y - line_spacing * 7 - second_gap], "left");
    
    // Cycle 3
    emboss_text(line9, body_size, body_font, [left_margin, first_line_y - line_spacing * 8 - second_gap * 2], "left");
    emboss_text(line10, body_size, body_font, [left_margin, first_line_y - line_spacing * 9 - second_gap * 2], "left");
    emboss_text(line11, body_size, body_font, [left_margin, first_line_y - line_spacing * 10 - second_gap * 2], "left");
    emboss_text(line12, body_size, body_font, [left_margin, first_line_y - line_spacing * 11 - second_gap * 2], "left");
    emboss_text(line13, body_size, body_font, [left_margin, first_line_y - line_spacing * 12 - second_gap * 2], "left");
    emboss_text(line14, body_size, body_font, [left_margin, first_line_y - line_spacing * 13 - second_gap * 2], "left");
    emboss_text(line15, body_size, body_font, [left_margin, first_line_y - line_spacing * 14 - second_gap * 2], "left");
  }
}

// Place plaque with its bottom-left corner at (0,0) for convenience
translate([plaque_width/2, plaque_height/2, 0]) plaque();

// --- Slicing Notes ---
// 1) Set a color change at Z = base_thickness (e.g., 2.0 mm) in your slicer
//    so the text prints in the second filament color.
// 2) Ensure text_height provides at least 2 solid layers for reliable coverage
//    with your layer height (e.g., 0.2 mm -> text_height >= 0.4 mm).
// 3) If your system lacks the specified fonts, change title_font/body_font
//    to fonts installed locally (e.g., "DejaVu Sans").