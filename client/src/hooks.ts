import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store/store';

// Type-safe version of useDispatch hook
// This ensures that dispatched actions are properly typed based on our store configuration
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// Type-safe version of useSelector hook
// This ensures that selected state is properly typed based on our root state type
export const useAppSelector = useSelector.withTypes<RootState>();
