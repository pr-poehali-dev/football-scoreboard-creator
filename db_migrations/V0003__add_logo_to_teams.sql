-- Добавляем поле для хранения URL логотипа команды
ALTER TABLE t_p25880974_football_scoreboard_.teams 
ADD COLUMN logo_url TEXT DEFAULT NULL;