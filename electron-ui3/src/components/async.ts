import { Observable, Subject, takeUntil } from 'rxjs';
import { onUnmounted } from 'vue';

/**
 *
 */
export function bindToComponent<T>(v: Observable<T>) {
    const destroy$ = new Subject<void>();
    onUnmounted(() => {
        destroy$.next();
        destroy$.complete();
    });
    return v.pipe(takeUntil(destroy$));
}
