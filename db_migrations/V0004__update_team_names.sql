-- Обновление названий команд
UPDATE t_p25880974_football_scoreboard_.teams 
SET name = 'ФК ТОРНАДО', updated_at = CURRENT_TIMESTAMP 
WHERE id = '1';

UPDATE t_p25880974_football_scoreboard_.teams 
SET name = 'ФК НАГЛЕЦЫ ИЗ ВОРОНЕЖА', updated_at = CURRENT_TIMESTAMP 
WHERE id = '2';