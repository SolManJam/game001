Overview
The character string is a sequence of commands that guide a character’s behavior within a 9x9 grid. Each command can trigger movement, rotation, or a pause, with a default duration of 2 seconds per action unless modified. The sequence repeats indefinitely, allowing for continuous patterns of behavior. Commands include single letters (U, D, L, R, P), rotation instructions (S followed by an angle), and timing adjustments (M followed by a duration).
Command Reference
Here’s a quick summary of the valid commands:
Movement Commands: U, D, L, R

Rotation Command: S followed by 90, 180, or 270 (e.g., S90)

Pause Command: P

Timing Command: M followed by a positive number with one decimal place (e.g., M1.5)

Movement Commands
Movement commands direct the character relative to its current facing direction:
U: Move forward (in the direction the character is facing).

D: Move backward (opposite to the facing direction).

L: Move left (perpendicular to the facing direction).

R: Move right (perpendicular to the facing direction).

Each movement takes 2 seconds by default. If a movement would take the character outside the 9x9 grid, it rotates clockwise until a valid direction is found.
Rotation Command
The rotation command (S) changes the character’s facing direction without moving it:
S90: Rotate 90 degrees clockwise.

S180: Rotate 180 degrees clockwise.

S270: Rotate 270 degrees clockwise.

Rotations also default to a 2-second duration, adjustable via the M command.
Pause Command
The pause command (P) keeps the character stationary in its current position and direction for the specified duration (default 2 seconds, modifiable with M).
Timing Command
The timing command (M) adjusts the duration of the previous action in the sequence:
M<duration>: Sets the duration of the preceding action to <duration> seconds (e.g., M1.5 for 1.5 seconds).

The number must be positive and have exactly one decimal place (e.g., 0.5, 10.0).

If M lacks a preceding action or has an invalid format, it is ignored, and the default 2-second duration applies.

For example, in UM1.5, the U movement lasts 1.5 seconds.
Sequence Parsing
The character string is parsed into an array of commands for execution:
Single-letter commands (U, D, L, R, P) are standalone.

Rotation commands are S followed by 90, 180, or 270.

Timing commands are M followed by a valid number (e.g., M1.5).

Invalid characters or malformed commands are skipped.

For instance, the string UUS90M1.5P becomes ["U", "U", "S90", "M1.5", "P"].
Examples
Example 1: Basic Movement and Rotation
Sequence: UUS90P

Behavior:
Move up (2 seconds).

Move up (2 seconds).

Rotate 90 degrees clockwise (2 seconds).

Pause (2 seconds).

Repeat.

Example 2: Movement with Custom Timing
Sequence: UM1.5RM5.0P

Behavior:
Move up (1.5 seconds, due to M1.5).

Move right (5.0 seconds, due to M5.0).

Pause (2 seconds, default).

Repeat.

Example 3: Rotation with Custom Timing
Sequence: S90M0.5U

Behavior:
Rotate 90 degrees clockwise (0.5 seconds, due to M0.5).

Move up (2 seconds, default).

Repeat.

Edge Cases
Invalid M Command: If M is followed by an invalid number (e.g., M1, M1.55), it’s ignored, and the default 2-second duration applies.

First Command is M: An M at the start of the sequence is ignored since there’s no prior action to modify.

Multiple M Commands: Only the last M before an action sets its duration. For example, in UM1.5M2.0P, U takes 2.0 seconds.

Movement Blocked: If a movement would exit the grid, the character rotates clockwise until it can move legally.

